// usage: swift segment.swift IN.jpg OUT_mask.png  -> prints face JSON
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
let url = URL(fileURLWithPath: args[1])
let ci = CIImage(contentsOf: url, options: [.applyOrientationProperty: true])!
let handler = VNImageRequestHandler(ciImage: ci, options: [:])

let maskReq = VNGenerateForegroundInstanceMaskRequest()
let faceReq = VNDetectFaceLandmarksRequest()
try handler.perform([maskReq, faceReq])

if let obs = maskReq.results?.first {
    let buf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
    let m = CIImage(cvPixelBuffer: buf)
    let ctx = CIContext()
    let cg = ctx.createCGImage(m, from: m.extent)!
    let rep = NSBitmapImageRep(cgImage: cg)
    try rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[2]))
}
let W = ci.extent.width, H = ci.extent.height
var out: [String: Any] = ["w": W, "h": H]
if let f = faceReq.results?.max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
    let b = f.boundingBox
    // convert to top-left pixel coords
    out["face"] = [b.minX * W, (1 - b.maxY) * H, b.width * W, b.height * H]
    if let l = f.landmarks?.leftPupil?.pointsInImage(imageSize: ci.extent.size).first,
       let r = f.landmarks?.rightPupil?.pointsInImage(imageSize: ci.extent.size).first {
        out["eyes"] = [l.x, H - l.y, r.x, H - r.y]
    }
}
print(String(data: try JSONSerialization.data(withJSONObject: out), encoding: .utf8)!)

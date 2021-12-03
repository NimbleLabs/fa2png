import IconControl from './../controls/IconControl'


let canvas
let stage

let getSvg = (iconDescription, svg) => {
  if (!stage || !stage) {
    // initialisation
    canvas = document.createElement('CANVAS')
    stage = new window.createjs.Stage(canvas)
  } else {
    stage.removeAllChildren()
  }
  
  let icon = new IconControl(iconDescription, svg)
  let canvasSize = iconDescription.size + iconDescription.margin * 2

  canvas.setAttribute('width', canvasSize)
  canvas.setAttribute('height', canvasSize)
  stage.addChild(icon.getContainer())
  stage.update()
  
  let exporter = new window.SVGExporter(stage, false, false, false)
	exporter.run()

  let serializer = new window.XMLSerializer()
  let svgStr = serializer.serializeToString(exporter.svg)
  return "data:image/svg+xml,\n"+encodeURIComponent(svgStr)
}

 export default getSvg
 
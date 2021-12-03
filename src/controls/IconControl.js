const defaults = {
  color: '#0064FF',
  margin: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  size: 128
}

export default class IconControl {

  constructor (iconOptions, icon) {
    let options = Object.assign({}, defaults, iconOptions)
    this.color = options.color

    this.background = options.hasBackground ? options.background : 'transparent'
    // todo
    this.icon = icon
    this.container = new window.createjs.Container()
    this.shape = null
    this.bgShape = null
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    if (typeof options.margin === 'number') {
      this.margin = {
        left: options.margin,
        right: options.margin,
        top: options.margin,
        bottom: options.margin
      }
    }
    // this.maxSize = 0;
    this.imageSize = Number(options.size)
    this.init()
  }

  init () {
    this.calculateProperties()
    this.shape = new window.createjs.Shape()

    if (this.background !== 'transparent') {
      this.drawBackground()
    }

    this.drawIcon()
  }

  calculateProperties () {
    const HALF = 0.5
    var tempShape = new window.createjs.Shape()

    let response = tempShape.graphics.decodeSVGPath(this.icon.glyph._d)
    this.icon.bounds = response.rect

    let scale = this.imageSize / this.getSideValue()
    this.icon.scale = scale.toFixed(4)

    this.x = -this.icon.bounds.x1 * scale
    this.y = this.imageSize + (this.icon.bounds.y1 * scale)

    // center positioning:
    if (this.icon.bounds.height < this.icon.bounds.width) {
      this.y = this.y + (this.icon.bounds.height - this.icon.bounds.width) * scale * HALF
    } else {
      this.x = this.x + HALF * (this.icon.bounds.height - this.icon.bounds.width) * scale
    }
  }

  drawBackground () {
    let wholeWidth = this.imageSize + this.margin.left + this.margin.right
    let wholeHeight = this.imageSize + this.margin.top + this.margin.bottom
    this.bgShape = new window.createjs.Shape()
    this.bgShape.graphics.beginFill(this.background).drawRect(0, 0, wholeWidth, wholeHeight)
  }

  drawIcon () {
    this.shape.graphics.beginFill(this.color)
    this.shape.graphics.decodeSVGPath(this.icon.glyph._d)

    let scale = this.icon.scale
    this.shape.scaleY = -scale
    this.shape.scaleX = scale

    this.shape.x = this.x + this.margin.left
    this.shape.y = this.y + this.margin.top
  }

  getSideValue () {
    let bounds = this.icon.bounds
    return Math.max(bounds.width, bounds.height)
  }

  getContainer () {
    if (this.bgShape) {
      this.container.addChild(this.bgShape)
    }
    this.container.addChild(this.shape)
    return this.container
  }
}

// module.exports = IconControl

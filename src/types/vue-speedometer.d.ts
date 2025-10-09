
declare module "vue-speedometer" {
  import { DefineComponent } from "vue"

  enum Transition {
    easeLinear = "easeLinear",
    easeQuadIn = "easeQuadIn",
    easeQuadOut = "easeQuadOut",
    easeQuadInOut = "easeQuadInOut",
    easeCubicIn = "easeCubicIn",
    easeCubicOut = "easeCubicOut",
    easeCubicInOut = "easeCubicInOut",
    easePolyIn = "easePolyIn",
    easePolyOut = "easePolyOut",
    easePolyInOut = "easePolyInOut",
    easeSinIn = "easeSinIn",
    easeSinOut = "easeSinOut",
    easeSinInOut = "easeSinInOut",
    easeExpIn = "easeExpIn",
    easeExpOut = "easeExpOut",
    easeExpInOut = "easeExpInOut",
    easeCircleIn = "easeCircleIn",
    easeCircleOut = "easeCircleOut",
    easeCircleInOut = "easeCircleInOut",
    easeBounceIn = "easeBounceIn",
    easeBounceOut = "easeBounceOut",
    easeBounceInOut = "easeBounceInOut",
    easeBackIn = "easeBackIn",
    easeBackOut = "easeBackOut",
    easeBackInOut = "easeBackInOut",
    easeElasticIn = "easeElasticIn",
    easeElasticOut = "easeElasticOut",
    easeElasticInOut = "easeElasticInOut",
    easeElastic = "easeElastic",
  }

  enum CustomSegmentLabelPosition {
    Outside = "OUTSIDE",
    Inside = "INSIDE",
  }

  type CustomSegmentLabel = {
    text?: string
    position?: CustomSegmentLabelPosition
    fontSize?: string
    color?: string
  }

  interface SpeedometerProps {
    value?: number
    minValue?: number
    maxValue?: number
    segments?: number
    maxSegmentLabels?: number
    forceRender?: boolean
    width?: number
    height?: number
    dimensionUnit?: string
    fluidWidth?: boolean
    needleColor?: string
    startColor?: string
    endColor?: string
    segmentColors?: string[]
    needleTransition?: Transition
    needleTransitionDuration?: number
    needleHeightRatio?: number
    ringWidth?: number
    textColor?: string
    valueFormat?: string
    currentValueText?: string
    currentValuePlaceholderStyle?: string
    customSegmentStops?: number[]
    customSegmentLabels?: CustomSegmentLabel[]
    segmentValueFormatter?: (value: number) => string
    labelFontSize?: string
    valueTextFontSize?: string
    valueTextFontWeight?: string
    paddingHorizontal?: number
    paddingVertical?: number
    svgAriaLabel?: string
  }

  const VueSpeedometer: DefineComponent<SpeedometerProps>

  export { SpeedometerProps, CustomSegmentLabel, CustomSegmentLabelPosition, Transition }
  export default VueSpeedometer
}

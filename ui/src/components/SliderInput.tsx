interface SliderInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  min: number
  max: number
  step: number
  unit: string
}

const SliderInput: React.FC<SliderInputProps> = ({ label, name, value, onChange, min, max, step, unit }) => (
  <div className="space-y-2">
    <div className="flex justify-between">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <span className="text-sm font-semibold text-primary">
        {value || min}
        {unit}
      </span>
    </div>
    <input
      type="range"
      id={name}
      name={name}
      min={min}
      max={max}
      step={step}
      value={value || min}
      onChange={onChange}
      required
      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>
        {min}
        {unit}
      </span>
      <span>
        {max}
        {unit}
      </span>
    </div>
  </div>
)

export default SliderInput
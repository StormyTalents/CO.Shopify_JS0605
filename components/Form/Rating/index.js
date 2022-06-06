import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasFaCircle } from '@fortawesome/free-solid-svg-icons'
import { faStar as farFaCircle } from '@fortawesome/free-regular-svg-icons'

const Option = ({ value, currentSelected }) => {
  const iconProps = {
    width: 15,
    height: 15,
    className: "icon",
    icon: value <= currentSelected ? fasFaCircle : farFaCircle,
    color: '#1b3668'
  }
  return (
    <div className='wrapper-rating' onClick={(e) => e.stopPropagation()}>
      <input aria-selected={!!value <= currentSelected} className="checkbox" type="checkbox" id={`rating-${value}`} name="rating" value={value} />
      <FontAwesomeIcon {...iconProps}/>
    </div>
  )
}

const Rating = ({ onChange, selected }) => {
  return (
    <div className="input-trigger" style={{ marginBottom: 10, display: 'flex', columnGap: 5 }} onChange={onChange}>
      <Option value={1} currentSelected={selected} />
      <Option value={2} currentSelected={selected} />
      <Option value={3} currentSelected={selected} />
      <Option value={4} currentSelected={selected} />
      <Option value={5} currentSelected={selected} />
    </div>
  )
}

export default Rating;

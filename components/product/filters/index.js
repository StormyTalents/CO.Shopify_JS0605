import classNames from 'classnames';
import { ArrowDown, Close } from '@/components/icons'

const Filters = props => {
  const { section, isActive, onClick, options, title, Item } = props;

  const classWrapper = classNames("filter--", {
    [`filter--${section}`]: true, 
    "active": isActive
  });

  const classFilters = classNames("filter--content", {
    "active": isActive
  })

  const handleOnClick = () => {
    if (typeof onClick === 'function') {
      onClick(section)
    }
  };

  return (
    <div className={classWrapper}> 
      <div
        aria-controls={`${section}-dropdown`}
        aria-expanded={isActive ? "true" : "false"}
        className="filter--dropdown"
        onClick={handleOnClick}>
        <h5>{title}</h5>
        <ArrowDown />
      </div>
      <div id="type-dropdown" className={classFilters}>
        <button aria-label="close" className="close" onClick={handleOnClick}><Close/></button>
        
        <fieldset className="filter--list">
          {options.map((opt, i) => {

            if (Item) {
              return <Item {...opt} i={i} />
            }

            return ""
          })}
        </fieldset>
      </div>
    </div>
  )
}

export default Filters;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasFaCircle, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar as farFaCircle } from '@fortawesome/free-regular-svg-icons'

function ReviewStar({ star }) {
    return (
        <div className="review--star" id="review--star" data-star={star}>
            {star < 0.5 ?<FontAwesomeIcon role="img" aria-hidden="false" aria-labelledby='review--star' className="one--star--empty" aria-label='one star empty' icon={farFaCircle} color="#1b3668" />: "" }
            {star > 0.5 && star <= 1.5 || star >= 1 ?<FontAwesomeIcon role="img" aria-hidden="false" aria-labelledby='review--star'  className="one--star" icon={fasFaCircle} color="#1b3668" />:""}
            
            {star <= 1 ?<FontAwesomeIcon role="img" aria-hidden="false"aria-labelledby='review--star'  className="two--star--empty" aria-label='two star empty' icon={farFaCircle} color="#1b3668" />: "" }
            {star > 1 && star <= 1.5  ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star'  role="img" aria-label='two star half' className="two--star--half" icon={faStarHalfAlt} color="#1b3668" />:""}
            {star > 1.5 && star <= 2 || star >= 2 ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star'  role="img" className="two--star" aria-label='two star' icon={fasFaCircle} color="#1b3668" />:""}

            {star <= 2 ?<FontAwesomeIcon aria-labelledby='review--star' aria-hidden="false" role="img" className="three--star--empty" aria-label='three star empty' icon={farFaCircle} color="#1b3668" />: "" }
            {star > 2 && star <= 2.5  ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="three--star--half" aria-label='three star half' icon={faStarHalfAlt} color="#1b3668" />:""}
            {star > 2.5 && star <= 3 || star >= 3 ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="three--star" aria-label='three star' icon={fasFaCircle} color="#1b3668" />:""}

            {star <= 3 ?<FontAwesomeIcon aria-labelledby='review--star' aria-hidden="false" role="img" className="four--star--empty" aria-label='four star empty' icon={farFaCircle} color="#1b3668" />: "" }
            {star > 3 && star <= 3.5  ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="four--star--half" aria-label='four star half' icon={faStarHalfAlt} color="#1b3668" />:""}
            {star > 3.5 && star <= 4 || star >= 4 ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="four--star" aria-label='four star' icon={fasFaCircle} color="#1b3668" />:""}

            {star <= 4 ?<FontAwesomeIcon aria-labelledby='review--star' aria-hidden="false" role="img" className="four--star--empty" aria-label='five star empty' icon={farFaCircle} color="#1b3668" />: "" }
            {star > 4 && star <= 4.5  ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="four--star--half" aria-label='five star half' icon={faStarHalfAlt} color="#1b3668" />:""}
            {star > 4.5 && star <= 5 || star >= 5 ?<FontAwesomeIcon aria-hidden="false" aria-labelledby='review--star' role="img" className="four--star" aria-label='five star' icon={fasFaCircle} color="#1b3668" />:""}

        </div>
    )
}

export default ReviewStar
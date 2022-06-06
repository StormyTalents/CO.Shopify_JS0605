import classNames from 'classnames'

function ReviewFit({ score, scale }) {
    const pos = {
        left: score+"%"
      };

    return (
        <div className={classNames("fit", {'scale': scale})}>
            <h5>How would you rate the fit?</h5>
            {scale?
                <div className="fit--scale--wrap">
                    <div className="fit--scale">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <span className="scale--pos" data-score={score} style={pos}></span>
                    </div>
                    <div className="fit--lables">
                        <span>Too Small</span>
                        <span></span>
                        <span>True to Size</span>
                        <span></span>
                        <span>Too Big</span>
                    </div>
                </div>
            :   
                <div className='fit--bar--wrap'>
                    <div className="fit--bar">
                        {score >= 1 ? <div className="fit--bar--box oneBar full"></div>: "" }
                        {score < 1 ? <div className="fit--bar--box oneBar empty"></div>: "" }
                        {score >= 2 ? <div className="fit--bar--box twoBar full"></div>: "" }
                        {score < 2 ? <div className="fit--bar--box twoBar empty"></div>: "" }
                        {score >= 3 ? <div className="fit--bar--box twoBar full"></div>: "" }
                        {score < 3 ? <div className="fit--bar--box twoBar empty"></div>: "" }
                        {score >= 4 ? <div className="fit--bar--box twoBar full"></div>: "" }
                        {score < 4 ? <div className="fit--bar--box twoBar empty"></div>: "" }
                        {score >= 5 ? <div className="fit--bar--box twoBar full"></div>: "" }
                        {score < 5 ? <div className="fit--bar--box twoBar empty"></div>: "" }
                        {score >= 6 ? <div className="fit--bar--box twoBar full"></div>: "" }
                        {score < 6 ? <div className="fit--bar--box twoBar empty"></div>: "" }
                    </div>
                        <div className="fit--lables">
                        <span>Too Small</span>
                        <span></span>
                        <span>True to Size</span>
                        <span></span>
                        <span>Too Big</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default ReviewFit
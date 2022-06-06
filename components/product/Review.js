import { useState, useRef, useEffect, memo } from 'react'
import Image from 'next/image'
import ReviewStar from '@/components/product/ReviewStar'
import ReviewForm from '@/components/product/ReviewForm'
import ReviewFit from '@/components/product/ReviewFit'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { Close } from '@/components/icons'
import classNames from 'classnames'

const postsPerPage = 3;
let arrayForHoldingReview = [];
let arrayForHoldingQuestion = [];

const ButtonTabs = memo(({ onClick, id, text, isActive }) => (
  <button
    role="tab"
    aria-controls={`product-${id}`}
    id={id}
    aria-selected={isActive}
    className={`review--nav--item ${id}--item`}
    onClick={onClick}
  >
    <h2 className='h3'>{text}</h2>
  </button>
))

function review({ reviews, reviewsPhoto, questions, product, chainProduct }) {

  const slider = useRef();
  const slidernav = useRef();
  const [slide, setSlide] = useState(false)
  let fitScore = 0
  let fitUser = 0
  reviews.data?
  reviews.data.map((review) => {
    fitScore += review.reviewOptionsList[0] && review.reviewOptionsList[0].message == "How would you rate the fit?" ? parseInt(review.reviewOptionsList[0].value) : 0
    fitUser += review.reviewOptionsList[0] && review.reviewOptionsList[0].message == "How would you rate the fit?" ? 1 : 0
  }) : ""
  const fitAverage = ((fitScore / fitUser) / 6) * 100

  let currentQuestion = null
  if(questions.results && questions.results.length != 0) {
    currentQuestion = questions.results.filter((idxs) => {
      return idxs.question.productName === product.title && idxs.question.state === 1; 
    })
  }

  var settings = {
    dots: false,
    fade: true,
    infinite: true,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
  };
  var slidenav = {
    dots: false,
    infinite: false,
    draggable: true,
    accessibility: false,
    swipeToSlide: true,
    slidesToShow: 10,
    slidesToScroll: 1,
    cssEase: 'linear',
    speed: 250,
  };
  const slidegoTo = (e, ind) => {
		e.preventDefault();
		slider.current.slickGoTo(ind)
    setSlide(slide?false:true)
	}
  const slidegoToNav = (e, ind) => {
		e.preventDefault();
		slider.current.slickGoTo(ind)
	}

  /* review & Question list */
  const [reviewToShow, setReviewToShow] = useState([]);
  const [nextReview, setNextReview] = useState(3);
  const [questionToShow, setQuestionToShow] = useState([]);
  const [nextQuestion, setNextQuestion] = useState(3);
  const [navStatus, setNavStatus] = useState("review");
  const [form, setForm] = useState("none");

  const loopWithSlice = (start, end, type) => {
    if (type == "review") {
    const slicedReview = reviews.data.slice(start, end);
    arrayForHoldingReview = [...arrayForHoldingReview, ...slicedReview];
    setReviewToShow(arrayForHoldingReview);
    }
    else {
      const slicedQuestion = currentQuestion.slice(start, end);
      arrayForHoldingQuestion = [...arrayForHoldingQuestion, ...slicedQuestion];
      setQuestionToShow(arrayForHoldingQuestion);
    }
  };

  useEffect(() => {
    arrayForHoldingReview = [];
    arrayForHoldingQuestion = [];
    if(reviews.data && reviews != "Empty Single Review" ) {
      loopWithSlice(0, postsPerPage, "review");
    }
    if(currentQuestion) {
      loopWithSlice(0, postsPerPage, "question");
    }
  }, []);

  const handleShowMorePosts = (type) => {
    if (type == "review") {
      loopWithSlice(nextReview, nextReview + postsPerPage, type);
      setNextReview(nextReview + postsPerPage);
    }
    else {
      loopWithSlice(nextQuestion, nextQuestion + postsPerPage, type);
      setNextQuestion(nextQuestion + postsPerPage);
    }
  };

  const nav = (type) => {
    if (type == "review") {
      setNavStatus("review")
    }
    else {
      setNavStatus("question")
    }
  }

  const navForm = (type) => {
    if (form == type) {
      setForm("none")
    }
    else {
      if (type == "review") {
        setForm("review")
      }
      else if (type == "question"){
        setForm("question")
      }
      else {
        setForm("none")
      }
    }
  }

  const handleChangeReviewForm = event => {
    navForm(event.currentTarget.id)
  }

  const handleChangeTabReview = event => nav(event.currentTarget.id)

    return (
        <div className="review--section mb-75">
          <div className={classNames("review--nav", navStatus)}>
            <ButtonTabs
              id="review"
              isActive={navStatus === 'review'}
              onClick={handleChangeTabReview}
              text="Product Reviews"
            />
            <ButtonTabs
              id="question"
              isActive={navStatus === 'question'}
              onClick={handleChangeTabReview}
              text="Q&A"
            />
          </div>
          <div className="review-avarage-score">
            {reviews.total > 0 ? 
              <div className="reviews--score--number">
                <h2>{reviews.rating}</h2>
              </div>
            :""}
            {reviews.total > 0 ? 
              <div className="reviews--star">
                <ReviewStar star={reviews.rating}/>
              </div>
            :""}
            <div className="reviews--user">
              <h4>{reviews.total} reviews</h4>
            </div>
              {fitScore != 0?<ReviewFit scale score={fitAverage} />:""}
          </div>
          <div className="review--with--photo flex">
            { 
            reviewsPhoto.data?
              reviewsPhoto.data.map((reviewphoto, index) => (
                index <= 4 ? 
                  <div className="review--img--anchor"  key={index} onClick={(e) => slidegoTo(e, index)}>
                    {reviewphoto.reviewUserPhotos ?
                    <Image
                      src={`https://cdn.stamped.io/uploads/photos/${reviewphoto.reviewUserPhotos.split(",")[0]}`}
                      alt="Aftco review"
                      layout="fill"
                      className={`review--img`}
                    />
                    :
                    <Image
                      src={`https://cdn.stamped.io/uploads/videos/${reviewphoto.reviewUserVideos.split(",")[0]}.jpg`}
                      alt="Aftco review"
                      layout="fill"
                      className={`review--img`}
                    />
                    }
                  </div>
                  : ""
              )) :""
            }
          </div>
          <div className="review--actions">
            <button className="write--review" id="review" onClick={handleChangeReviewForm}>Write a Review</button>
            <button className="ask--question" id="question" onClick={handleChangeReviewForm}>Ask a Question</button>
          </div>
          <div className={classNames("review--popup", {"slide":slide})}>
            <>
            <div className="pop--bg" onClick={(e) => slidegoTo(e, 0)}></div>
              <div className='slide-pop-wrap'>
              <button className="close" onClick={(e) => slidegoTo(e, 0)} aria-label="Close">
                <Close/>
              </button>
                <Slider asNavFor={slidernav.current} ref={slider} {...settings}>
                  { reviewsPhoto.data?
                    reviewsPhoto.data.map((review, index) => (
                      <div className="review--item--wrap" key={index}>
                        <div className="review--item flex">
                          <div className="review--img--item">
                            {review.reviewUserPhotos ?
                              <Image
                                src={`https://cdn.stamped.io/uploads/photos/${review.reviewUserPhotos.split(",")[0]}`}
                                alt="Aftco review"
                                layout="fill"
                                objectFit="contain"
                                className={`slide--review--img`}
                              />
                            :
                              <Image
                                src={`https://cdn.stamped.io/uploads/videos/${review.reviewUserVideos.split(",")[0]}.jpg`}
                                alt="Aftco review"
                                layout="fill"
                                objectFit="contain"
                                className={`slide--review--img`}
                              />
                            }
                          </div>
                          <div className='review--info'>
                            <h2 className='h4'>{review.author} <span>{review.reviewVerifiedType == 2? "Verified Buyer": ""}</span></h2>
                            <ReviewStar star={review.reviewRating}/>
                            <h3 className="title h4">{review.reviewTitle}</h3>
                            <p className='p content'>{review.reviewMessage}</p>
                            <hr/>
                            <div className="review--product--img mt-20">
                              <Image
                                src={review.productImageThumbnailUrl.split(",")[0]}
                                alt="aftco review"
                                height={180}
                                width={180}
                                layout="responsive"
                                className={`hidden sm:inline-flex`}
                              />
                              <p className='p center'>{review.productName}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) : ""
                  }
                </Slider>
                <div className="slide--nav desktop">
                  <Slider  asNavFor={slider.current} ref={slidernav} {...slidenav}>
                    { reviewsPhoto.data?
                      reviewsPhoto.data.map((review, index) => (
                        <div className="review--item--nav--wrap" key={index} onClick={(e) => slidegoToNav(e, index)}>
                          <div className="review--item--nav" key={index} onClick={(e) => slidegoToNav(e, index)}>
                            {review.reviewUserPhotos ?
                              <Image
                                src={`https://cdn.stamped.io/uploads/photos/${review.reviewUserPhotos.split(",")[0]}`}
                                alt="Aftco review"
                                layout="fill"
                                objectFit='cover'
                                className={`slide--review--img`}
                              />
                            :
                              <Image
                                src={`https://cdn.stamped.io/uploads/videos/${review.reviewUserVideos.split(",")[0]}.jpg`}
                                alt="Aftco review"
                                layout="fill"
                                objectFit='contain'
                                className={`slide--review--img`}
                              />
                            }
                          </div>
                        </div>
                      )) : ""
                    }
                  </Slider>
                </div>
              </div>
            </>
          </div>
          <div className="review--head " >
            {form == "review"? <ReviewForm product={product} type="review" /> : ""}
            {form == "question"? <ReviewForm product={product} type="question" /> : ""}
            {form == "none"?"":<button className="button black mt-30 mobile" onClick={() => navForm("none")}>cancel</button>}
          </div>
          {navStatus == "review" ?
            <div className="review--detail">
            { reviews.data?
              reviewToShow.map((review, index) => (
                <div className="review--item" key={index}>
                  <div className="review--item--head">
                    <div className="review--item--author">
                      <ReviewStar star={review.reviewRating}/><br/>
                      <div className='review--loc flex'>
                          {review.countryIso?
                            <div className='img--wrap-country'>
                              <Image
                                src={`https://cdn.stamped.io/cdn/flags/${review.countryIso.toLowerCase()}.svg`}
                                alt="Aftco review"
                                height={18}
                                width={13}
                                layout="responsive"
                                className={`slide--review--flag`}
                              />
                            </div>
                          :""}
                        <span>{review.location}</span>
                      </div>
                      <h5>{review.author} <span>{review.reviewVerifiedType == 2? "Verified Buyer": ""}</span></h5>
                    </div>
                    <span className="date--created">{review.reviewDate}</span>
                  </div>
                  {review.reviewOptionsList?
                    <div className='review--feedback flex'>
                      {review.reviewOptionsList[0] && review.reviewOptionsList[0].message == "How would you rate the fit?"?
                      <div className='review--single-fit'>
                        <ReviewFit score={review.reviewOptionsList[0].value} />
                      </div>
                      :""}
                      {review.reviewOptionsList[0] && review.reviewOptionsList[0].message == "Size Purchased"?
                      <div className='review--single-size'>
                        <h5>Size Purchased</h5>
                        <p>{review.reviewOptionsList[1].value}</p>
                      </div>
                      :""}
                      {review.reviewOptionsList[1] && review.reviewOptionsList[1].message == "How would you rate the fit?"?
                      <div className='review--single-fit'>
                        <ReviewFit score={review.reviewOptionsList[0].value} />
                      </div>
                      :""}
                      {review.reviewOptionsList[1] && review.reviewOptionsList[1].message == "Size Purchased"?
                      <div className='review--single-size'>
                        <h5>Size Purchased</h5>
                        <p>{review.reviewOptionsList[1].value}</p>
                      </div>
                      :""}
                    </div>
                  :""}
                  <h5 className="title">{review.reviewTitle}</h5>
                  <p>{review.reviewMessage}</p>
                  {review.reviewReply?
                   <div className='review--item--head reply'>
                     <div className='reply--message'>
                      <h5 className="title">Aftco</h5>
                      <p>{review.reviewReply}</p>
                     </div>
                     <span className="date--created">{review.reviewReplyDate}</span>
                   </div>
                  :""}
                </div>
              )) : ""
            }
            {reviews.total > 0 && reviewToShow.length < reviews.data.length ? 
              <button className="button" onClick={() => handleShowMorePosts("review")}>Load more</button>
            :""}
          </div>
          :
            <div className="questions--detail">
            { currentQuestion && currentQuestion.length > 0 ?
            <>
              {questionToShow.map((item, index) => (
                <div className="questions--item" key={index}>
                  <h5>{item.question.name}</h5>
                  <p>{item.question.message}</p>
                  {item.question.answersList && item.question.answersList.length >= 1 ?
                    <div className="question--answer">
                      <p>Answers ({item.question.answersList.length})</p> 
                        { item.question.answersList?
                          item.question.answersList.map((answer, i) => (
                            answer.isPublic == true?
                              <div className="answer--item" key={i}>
                                <h5>{answer.name}</h5>
                                <p dangerouslySetInnerHTML={{__html: answer.message}} />
                              </div>
                            :""
                          )) : ""
                        }
                    </div>
                  :""}
                </div>
              ))}
              {currentQuestion && currentQuestion.length > 0 && questionToShow.length < currentQuestion.length ?
                <button className="button" onClick={() => handleShowMorePosts("question")}>Load more</button>
              :""}
              </>
              : ""
            }
          </div>
          }
      </div>
    )
}

export default review
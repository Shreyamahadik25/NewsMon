import React, { Component } from 'react'

export default class NewsItem extends Component {
  render() {
    let {title,description,imageUrl,newsUrl,author,publishdate}=this.props;
    return (
       <div className='container my-3'>
      <div className="card" >
  <img src={imageUrl} className=" card-img-top img-fluid" alt="..."/>
  <div className="card-body">
    <h5 className="card-title">{title}...</h5>
    <p className="card-text">{description}</p>
    <p className="card-text"><small className="text-muted">by {!author?"unknown":author} on {new Date(publishdate).toGMTString()} </small></p>
    <a href={newsUrl} target="_blank" className="btn btn-sm btn-primary">Read More...</a>
  </div>
</div>
</div>
    )
  }
}

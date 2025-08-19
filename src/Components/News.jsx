import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from '../Components/Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],   // ✅ always start with empty array
      loading: false,
      page: 1,
      totalResults: 0
    };
  }

  async componentDidMount() {
    this.fetchNews();
  }

  fetchNews = async () => {
    this.setState({ loading: true });

    const ApiKey = import.meta.env.VITE_API_KEY;  // ✅ get key from .env
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&page=${this.state.page}&pageSize=${this.props.pageSize}&apiKey=${ApiKey}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log("API Response:", parsedData); // ✅ debug

      this.setState({
        articles: parsedData.articles || [],        // ✅ fallback to []
        totalResults: parsedData.totalResults || 0,
        loading: false,
        page: 1
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({ loading: false });
    }
  };

  fetchMoreData = async () => {
    const nextPage = this.state.page + 1;
    const ApiKey = import.meta.env.VITE_API_KEY;

    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&page=${nextPage}&pageSize=${this.props.pageSize}&apiKey=${ApiKey}`;

    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      console.log("API Response (more):", parsedData); // ✅ debug

      this.setState({
        articles: this.state.articles.concat(parsedData.articles || []), // ✅ safe concat
        totalResults: parsedData.totalResults || this.state.totalResults,
        page: nextPage
      });
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
  };

  render() {
    return (
      <div style={{ overflowX: 'hidden' }}>
        <div className="container-fluid px-3 my-3">
          <h2 className="text-center" style={{ marginTop: '60px' }}>
            NewsMonkey - Top Headlines
          </h2>

          <InfiniteScroll
            dataLength={this.state.articles ? this.state.articles.length : 0}   // ✅ safe
            next={this.fetchMoreData}
            hasMore={this.state.articles && this.state.articles.length < this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="row no-gutters">
              {this.state.articles && this.state.articles.length > 0 ? (
                this.state.articles.map((element) => (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={element.description ? element.description.slice(0, 45) : ""}
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      publishdate={element.publishedAt}
                    />
                  </div>
                ))
              ) : (
                !this.state.loading && <p className="text-center">No news available.</p>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

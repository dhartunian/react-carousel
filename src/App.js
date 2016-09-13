import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class CarouselItem extends Component {

  renderText(txt) {
    if (txt) {
      return <p>{txt}</p>
    }
  }

  render() {
    return(
      <div className='idora-slide'>
        <a href='#'>
          <img src={this.props.src} />
          {this.renderText(this.props.txt)}
        </a>
      </div>
    )
  }
}

class IdoraStage extends Component {
  constructor(args) {
    super(args)

    this.ensureActiveItemVisible = this.ensureActiveItemVisible.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.leftmost_item !== prevProps.leftmost_item) {
      this.ensureActiveItemVisible();
    }
  }

  ensureActiveItemVisible() {
    var selectedItem = this._selected;
    if (selectedItem) {
      var selectedItemNode = ReactDOM.findDOMNode(selectedItem);
      var stageNode = ReactDOM.findDOMNode(this);

      var selectedLeft = selectedItemNode.getBoundingClientRect().left;
      var stageLeft = stageNode.getBoundingClientRect().left;

      var newStageLeft = selectedLeft - stageLeft

      if (this.props.leftmost_item !== 0) {
        newStageLeft -= this.props.peek
      }

      stageNode.style.left = `${-1 * newStageLeft}px`;
    }
  }

  render() {
    const carousel_items = this.props.carousel_items;
    const leftmost_item = this.props.leftmost_item;
    const self = this;
    return (
      <div className='idora-stage'>
        {carousel_items.map(function(item, index) {
          return (
            <CarouselItem src={item.src} txt={item.txt} key={item.src}
                          ref={(ci) => {
                                 if (leftmost_item === index) {
                                   self._selected = ci
                               }}}/>)
        })}
      </div>
    )
  }
}

class IdoraNav extends Component {

  render() {
    return (
      <div className='idora-nav'>
        <div className='idora-prev idora-arrow'
             onClick={this.props.scrollPrev} />
        <div className='idora-next idora-arrow'
             onClick={this.props.scrollNext} />
      </div>
    )
  }
}

class IdoraDots extends Component {
  render() {
    return (
      <div></div>
    )
  }
}

class Idora extends Component {

  constructor(props) {
    super(props);
    this.state = {
      carousel_items: props.carousel_items,
      loop: false,
      leftmost_item: 0,
      peek: 30
    }

    this.scrollNext = this.scrollNext.bind(this);
    this.scrollPrev = this.scrollPrev.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
  }

  scrollBy(amount) {
    const leftmost_item = this.state.leftmost_item
    const num_carousel_items = this.state.carousel_items.length
    const new_leftmost = (leftmost_item + amount) % num_carousel_items

    this.setState({
      leftmost_item: new_leftmost
    })
  }

  scrollNext() {
    this.scrollBy(1);
  }

  scrollPrev() {
    this.scrollBy(-1);
  }

  render() {
    return (
      <div id='idora'>
        <div className='idora-inner'>
          <IdoraStage carousel_items={this.state.carousel_items}
                      leftmost_item={this.state.leftmost_item}
                      peek={this.state.peek}/>
        </div>
        <IdoraNav scrollNext={this.scrollNext} scrollPrev={this.scrollPrev}
                  showNext={true} showPrev={true} />
        <IdoraDots />
      </div>
    )
  }
}

export default Idora;

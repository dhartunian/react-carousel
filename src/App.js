import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Hammer from 'hammerjs';
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
    const prevDisabledClass = this.props.disablePrev ? 'idora-disabled' : ''
    const nextDisabledClass = this.props.disableNext ? 'idora-disabled' : ''
    return (
      <div className='idora-nav'>
        <div className={'idora-prev idora-arrow ' + prevDisabledClass}
             onClick={this.props.scrollPrev} />
        <div className={'idora-next idora-arrow ' + nextDisabledClass}
             onClick={this.props.scrollNext} />
      </div>
    )
  }
}

class IdoraDot extends Component {
  render() {
    const active_class = this.props.active ? 'idora-active' : ''
    return (
      <div>
        <div className={'idora-dot ' + active_class}
             onClick={this.props.dotClick}>
        </div>
      </div>
    )
  }
}

class IdoraDots extends Component {
  renderDots(carousel_items, scrollTo, leftmost_item, slides_per_dot) {
    var dots = []
    carousel_items.forEach(function(item, i) {
      if (i % slides_per_dot === 0) {
        const active = (leftmost_item >= i) &&
                       (leftmost_item < (i + slides_per_dot))
        dots.push(<IdoraDot active={active}
                            dotClick={() => scrollTo(i)}
                            key={i}/>)
      }
    })
    return dots
  }

  render() {
    return (
      <div className='idora-dots'>
        {this.renderDots(this.props.carousel_items,
                         this.props.scrollTo,
                         this.props.leftmost_item,
                         this.props.slides_per_dot)}
      </div>
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
      peek: 30,
      slides_per_dot: this.getSlidesPerDotBasedOnWindowWidth()
    }

    this.scrollNext = this.scrollNext.bind(this);
    this.scrollPrev = this.scrollPrev.bind(this);
    this.scrollBy = this.scrollBy.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSwipe = this.handleSwipe.bind(this);
  }

  scrollBy(amount) {
    const leftmost_item = this.state.leftmost_item
    const num_carousel_items = this.state.carousel_items.length
    const new_leftmost = (leftmost_item + amount) % num_carousel_items
    this.scrollTo(new_leftmost)
  }

  scrollTo(new_leftmost) {
    this.setState({
      leftmost_item: Math.max(0, new_leftmost)
    })
  }

  scrollNext() {
    this.scrollBy(1);
  }

  scrollPrev() {
    this.scrollBy(-1);
  }

  getSlidesPerDotBasedOnWindowWidth() {
    const w = window.innerWidth;
    var slides_per_dot = 3;

    if (w > 1500) { slides_per_dot = 1}
    else if (w > 1100) { slides_per_dot = 2 }

    return slides_per_dot
  }

  handleResize() {
    this.setState({
      slides_per_dot: this.getSlidesPerDotBasedOnWindowWidth()
    });
  }

  handleKeyDown(e) {
    if (e.which === 37) {
      e.preventDefault();
      this.scrollPrev();
    }
    if (e.which === 39) {
      e.preventDefault();
      this.scrollNext();
    }
  }

  handleDragStart() {
    return false;
  }

  handleSwipe(ev) {
    var deltaY = ev.deltaY;
    var deltaX = ev.deltaX;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      var scrollAmt = Math.min(Math.round(deltaX / -8), 10);
      this.scrollBy(scrollAmt);
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);

    const thisNode = ReactDOM.findDOMNode(this);
    thisNode.addEventListener('dragstart', this.handleDragStart)

    this.hammer = new Hammer(thisNode);
    this.hammer.on('panstart', this.handleSwipe);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    ReactDOM.findDOMNode(this).removeEventListener('dragstart', this.handleDragStart);
    this.hammer.off('panstart', this.handleSwipe);
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
                  disableNext={this.state.leftmost_item === (this.state.carousel_items.length || 0) - 1}
                  disablePrev={this.state.leftmost_item === 0} />
        <IdoraDots scrollTo={this.scrollTo}
                   carousel_items={this.state.carousel_items}
                   leftmost_item={this.state.leftmost_item}
                   slides_per_dot={this.state.slides_per_dot}/>
      </div>
    )
  }
}

export default Idora;

import React from 'react';
import PropTypes from 'prop-types';
import './ReactPullToRefresh.scss';
//  down up loading done
class ReactPullToRefresh extends React.Component{

  constructor(props){
    super(props);

    this.element = React.createRef();
    this.layer = React.createRef();
    this.view = React.createRef();
    this.addEventListener = this.addEventListener.bind(this);
  }

  componentDidMount(){
    if(!this.props.disabled){
      this.addEventListener();
    }
  }

  addEventListener(){
    //mobile
    this.element.current.addEventListener('touchstart', touchStart, false);
    this.element.current.addEventListener('touchmove', touchMove, false);
    this.element.current.addEventListener('touchend', touchEnd, false);
    //pc
    this.element.current.addEventListener('mousedown', touchStart, false);
    this.element.current.addEventListener('mousemove', touchMove, false);
    this.element.current.addEventListener('mouseup', touchEnd, false);

    const self = this;
    let isLoading = false;
    let isTouchStart = false; // 是否已经触发下拉条件
    let isDragStart = false; // 是否已经开始下拉
    let hasTouch = 'ontouchstart' in window;//判断是否是在移动端手机上
    let startX, startY; // 下拉方向，touchstart 时的点坐标
    function touchStart(event){
      if(self.element.current.scrollTop <= 0){
        isTouchStart = true;
        startY = hasTouch ? event.changedTouches[0].pageY : event.pageY;
        startX = hasTouch ? event.changedTouches[0].pageX : event.pageX;
      }
    }

    function touchMove(event){
        if(!isTouchStart) return ;
        let distanceY = (hasTouch ? event.changedTouches[0].pageY : event.pageY) - startY;
        let distanceX = (hasTouch ? event.changedTouches[0].pageX : event.pageX) - startX;
        if (Math.abs(distanceX) > Math.abs(distanceY) || isLoading) return;  //如果X方向上的位移大于Y方向，则认为是左右滑动

        if(distanceY > 0){
          if(!isDragStart ) isDragStart = true;
          self.layer.current.style.display = 'block';
          self.layer.current.style.transform = `translateY(0px)`;
          self.layer.current.className = `drop-down-refresh-layer`;
          self.view.current.style.transform = `translate(0px, ${distanceY}px) scale(1) translateZ(0px)`;
          if(distanceY > 40){
            self.layer.current.className = 'drop-down-refresh-layer refresh-pull-up';
          }
        }else{
          self.view.current.style.transform = `translate(0px, 0px) scale(1) translateZ(0px)`;
        }
    }

    function touchEnd(e){
      isDragStart = false;
      if(isLoading) return ;
      isLoading  = true;
      //console.log('touchEnd',touchEnd);
      self.layer.current.children[0].style.display = 'none';
      self.layer.current.children[1].style.display = 'block'; //loading show
      self.view.current.style.transform = `translate(0px, 0px) scale(1) translateZ(0px)`;
      new Promise((resolve,reject)=>{
        self.props.onRefresh(resolve,reject)
      }).then(()=>{
        isLoading = false;
        self.layer.current.style.display = 'none';
        self.layer.current.children[0].style.display = 'block';
        self.layer.current.children[1].style.display = 'none';
      }).catch((err)=>{
        isLoading = false;
        self.layer.current.style.display = 'none';
        self.layer.current.children[0].style.display = 'block';
        self.layer.current.children[1].style.display = 'none';
      })

    }
  }


  render(){
    const {
      children,
      onRefresh,
      className,
      disabled,
      ...rest
    } = this.props;

    if(disabled){
      return (
        <div>
          {
            children
          }
        </div>
      )
    }

    return (
      <div ref={this.element} className={`drop-down-refresh-wrapper ${className}`}  { ...rest} >
        <div className="drop-down-refresh-layer" ref={this.layer}>
            <div className="refresh-pull-arrow"></div>
            <div className="refresh-pull-loading">
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
        <div className="drop-down-refresh-view" ref={this.view}>
          {
            children
          }
        </div>
      </div>
    )
  }
}

ReactPullToRefresh.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
}

export default ReactPullToRefresh;

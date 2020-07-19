import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { gsap } from 'gsap';
import { CarouselModel } from './models/CarouselModel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: true }) carousel: ElementRef<HTMLDivElement>;
  @ViewChild('carouselContainer', { static: true })
  carouselContainer: ElementRef<HTMLDivElement>;

  @Input() data: CarouselModel[];

  baseZIndex = 50;
  scaleRatio = 10;
  middleIndex: number;
  isAnimaiting = false;
  prevSlideFinished = false;
  constructor() {}

  ngOnInit(): void {}

  initCarousel(): void {
    if (this.carousel && this.carousel.nativeElement) {
      // position all ements to center
      gsap.to(this.carousel.nativeElement.children, {
        duration: 0,
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });

      // find mid element index and make it main
      this.middleIndex = Math.ceil(
        this.carousel.nativeElement.childNodes.length / 2
      );
      const midElement = this.carousel.nativeElement.children[
        this.middleIndex - 1
      ];
      gsap.to(midElement, {
        duration: 0,
        zIndex: this.baseZIndex,
        width: '650px',
      });

      this.positionLeftNodes(this.middleIndex);
      this.positionRightNodes(this.middleIndex);
    }
  }

  positionLeftNodes(midIndex: number): void {
    let countingForwards = 0;
    let currZindex = 0;
    for (let i = midIndex - 1; i >= 0; i--) {
      countingForwards++;
      currZindex -= 1;
      const leftNodes = this.carousel.nativeElement.children[
        i - 1
      ] as HTMLDivElement;
      if (leftNodes) {
        gsap.to(leftNodes, {
          duration: 0,
          zIndex: currZindex,
          x: -(80 * countingForwards),
          scale: `0.${this.scaleRatio - countingForwards}`,
        });
      }
    }
  }
  positionRightNodes(midIndex: number): void {
    const carouselLength = this.carousel.nativeElement.children.length;
    let countingForwards = 0;
    let currZindex = this.baseZIndex;
    for (let i = midIndex; i < carouselLength; i++) {
      countingForwards++;
      currZindex -= 1;
      const rightNodes = this.carousel.nativeElement.children[
        i
      ] as HTMLDivElement;
      if (rightNodes) {
        gsap.to(rightNodes, {
          duration: 0,
          zIndex: currZindex,
          x: 80 * countingForwards,
          scale: `0.${this.scaleRatio - countingForwards}`,
        });
      }
    }
  }

  get noMoreElements(): boolean {
    return (
      this.carousel.nativeElement.children[this.middleIndex + 1] === undefined
    );
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  next() {
    this.isAnimaiting = true;
    this.prevSlideFinished = false;
    // dynamically changing element positions
    if (this.middleIndex > 1) {
      this.moveLeftSideAlongWithMainElement();
      this.moveRemainingRightSide();
    }
  }
  moveRemainingRightSide(): void {
    const length = this.carousel.nativeElement.children.length;
    for (let i = this.middleIndex; i < length; i++) {
      // getting current style values
      const element = this.carousel.nativeElement.children[i] as any;
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currZIndex = gsap.getProperty(element, 'zIndex');
      const currentScale = gsap.getProperty(element, 'scale');

      gsap.to(element, {
        duration: 0.3,
        zIndex: typeof currZIndex === 'number' && currZIndex - 1,
        x:
          typeof currentTranslateXValue === 'number' &&
          currentTranslateXValue + 80,
        scale:
          typeof currentScale === 'number' &&
          parseFloat((currentScale - 0.1).toFixed(1)),
        onComplete: () => (this.isAnimaiting = false),
      });
    }
  }

  moveLeftSideAlongWithMainElement(): void {
    for (let i = 0; i <= this.middleIndex; i++) {
      // getting current style values
      const element = this.carousel.nativeElement.children[i] as HTMLDivElement;
      const prevElement = this.carousel.nativeElement.children[
        i - 1
      ] as HTMLDivElement;
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currZIndex = gsap.getProperty(element, 'zIndex');
      const currentScale = gsap.getProperty(element, 'scale');

      if (currZIndex === this.baseZIndex) {
        // we found main element, move this to right side and decrease z-index

        gsap.to(element, {
          duration: 0.3,
          zIndex: typeof currZIndex === 'number' && currZIndex - 1,
          x: 80,
          scale: '0.9',
        });
        // update previous z-index to be main
        gsap.to(prevElement, {
          duration: 0.3,
          zIndex: this.baseZIndex,
        });

        // update middle index
        this.middleIndex = i;
      } else {
        // move all the remaining elemets to left
        gsap.to(element, {
          duration: 0.3,
          zIndex: typeof currZIndex === 'number' && currZIndex + 1,
          x:
            typeof currentTranslateXValue === 'number' &&
            currentTranslateXValue + 80,
          scale:
            typeof currentScale === 'number' &&
            parseFloat((currentScale + 0.1).toFixed(1)),
        });
      }
    }
  }

  // prev methods
  moveRemainingRightSidePrev(): void {
    let currZIndex = this.baseZIndex;
    const length = this.carousel.nativeElement.children.length;
    for (let i = this.middleIndex + 1; i < length; i++) {
      const element = this.carousel.nativeElement.children[i] as any;
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currentScale = gsap.getProperty(element, 'scale');
      currZIndex--;

      gsap.to(element, {
        duration: 0.3,
        zIndex: currZIndex,
        x:
          typeof currentTranslateXValue === 'number' &&
          currentTranslateXValue - 80,
        scale:
          typeof currentScale === 'number' &&
          parseFloat((currentScale + 0.1).toFixed(1)),
      });
    }
  }

  moveLeftSideAlongWithMainElementPrev(): void {
    for (let i = this.middleIndex; i >= 0; i--) {
      // temp variables
      const element = this.carousel.nativeElement.children[i] as HTMLDivElement;
      const nextElement = this.carousel.nativeElement.children[
        i + 1
      ] as HTMLDivElement;
      // style values
      const currentTranslateXValue = gsap.getProperty(element, 'translateX');
      const currZIndex = gsap.getProperty(element, 'zIndex');
      const currentScale = gsap.getProperty(element, 'scale');

      if (currZIndex === this.baseZIndex) {
        // we found main element, move this to left side and assign negative z index
        gsap.to(element, {
          duration: 0.3,
          zIndex: -1,
          x:
            typeof currentTranslateXValue === 'number' &&
            currentTranslateXValue - 80,
          scale:
            typeof currentScale === 'number' &&
            parseFloat((currentScale - 0.1).toFixed(1)),
        });
        // update next z-index to be main
        gsap.to(nextElement, {
          duration: 0.3,
          zIndex: this.baseZIndex,
          x:
            typeof currentTranslateXValue === 'number' &&
            currentTranslateXValue,
          scale:
            typeof currentScale === 'number' &&
            parseFloat(currentScale.toFixed(1)),
        });
        this.middleIndex = i + 1;
      } else {
        gsap.to(element, {
          duration: 0.3,
          zIndex: typeof currZIndex === 'number' && currZIndex - 1,
          x:
            typeof currentTranslateXValue === 'number' &&
            currentTranslateXValue - 80,
          scale:
            typeof currentScale === 'number' &&
            parseFloat((currentScale - 0.1).toFixed(1)),
          onComplete: () => {
            this.isAnimaiting = false;
            if (this.noMoreElements) {
              this.prevSlideFinished = true;
            } else {
              this.prevSlideFinished = false;
            }
          },
        });
      }
    }
  }

  prev() {
    this.isAnimaiting = true;
    this.moveLeftSideAlongWithMainElementPrev();
    this.moveRemainingRightSidePrev();
  }
}

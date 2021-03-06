import 'core-js/modules/es6.weak-map'; // For PhantomJS
import StructuredList from '../../src/components/structured-list/structured-list';
import HTML from '../../src/components/structured-list/structured-list--selection.html';

describe('StructuredList', function() {
  describe('Constructor', function() {
    let instance;
    let element;
    let wrapper;

    before(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should throw if root element is not given', function() {
      expect(() => {
        new StructuredList();
      }).to.throw(Error);
    });

    it('should throw if root element is not a DOM element', function() {
      expect(() => {
        new StructuredList(document.createTextNode(''));
      }).to.throw(Error);
    });

    it('should set default options', function() {
      expect(instance.options).to.deep.equal({
        selectorInit: '[data-structured-list]',
        selectorRow:
          '[data-structured-list] .bx--structured-list-tbody > label.bx--structured-list-row',
        classActive: 'bx--structured-list-row--selected',
      });
    });

    after(function() {
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_handleKeydownChecked(evt)', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called on "enter" keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownChecked');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 13 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should be called on "space" keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownChecked');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 32 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should not be called with another keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownChecked');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 40 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.not.have.been.called;
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_handleClick(evt)', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called on "click" keydown event', function() {
      spy = sinon.spy(instance, '_handleClick');
      const event = Object.assign(
        new CustomEvent('click', {
          bubbles: true,
        })
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should toggle classActive on a selectorRow', function() {
      spy = sinon.spy(instance, '_handleClick');
      const event = Object.assign(
        new CustomEvent('click', {
          bubbles: true,
        })
      );
      const rows = instance.element.querySelectorAll(
        instance.options.selectorRow
      );
      rows[1].dispatchEvent(event);
      expect(rows[1].classList.contains(instance.options.classActive)).to.equal(
        true
      );
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_direction(evt)', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called on "up" keydown event', function() {
      spy = sinon.spy(instance, '_direction');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 38 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should be called on "down" keydown event', function() {
      spy = sinon.spy(instance, '_direction');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 40 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should return -1 on "up" key', function() {
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 38 }
      );
      const direction = instance._direction(event);
      expect(direction).to.equal(-1);
    });

    it('should return 1 on "down" key', function() {
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 40 }
      );
      const direction = instance._direction(event);
      expect(direction).to.equal(1);
    });

    it('should return undefined on other key presses', function() {
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 70 }
      );
      const direction = instance._direction(event);
      expect(direction).to.be.undefined;
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_nextIndex()', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called', function() {
      spy = sinon.spy(instance, '_nextIndex');
      instance._nextIndex([0, 1, 2, 3], 0, 1);
      expect(spy).to.have.been.called;
    });

    it('should return a number', function() {
      const array = [0, 1, 2, 3];
      const result = instance._nextIndex(array, 0, 1);
      expect(typeof result).to.equal('number');
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_handleInputChecked()', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called', function() {
      spy = sinon.spy(instance, '_handleInputChecked');
      instance._handleInputChecked(0);
      expect(spy).to.have.been.called;
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });

  describe('_handleKeydownArrow(evt)', function() {
    let instance;
    let element;
    let wrapper;
    let spy;

    beforeEach(function() {
      wrapper = document.createElement('div');
      wrapper.innerHTML = HTML;
      document.body.appendChild(wrapper);
      element = document.querySelector('[data-structured-list]');
      instance = new StructuredList(element);
    });

    it('should be called on "up" keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownArrow');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 38 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should be called on "down" keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownArrow');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 40 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.have.been.called;
    });

    it('should not be called with another keydown event', function() {
      spy = sinon.spy(instance, '_handleKeydownArrow');
      const event = Object.assign(
        new CustomEvent('keydown', {
          bubbles: true,
        }),
        { which: 13 }
      );
      instance.element.dispatchEvent(event);
      expect(spy).to.not.have.been.called;
    });

    afterEach(function() {
      spy.restore();
      instance.release();
      document.body.removeChild(wrapper);
    });
  });
});

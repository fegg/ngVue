import angular from 'angular'
import Vue from 'vue'

const HelloComponent = Vue.component('hello-component', {
  props: {
    firstName: String,
    lastName: String
  },
  render (h) {
    return (<span>Hello {this.firstName} {this.lastName}</span>)
  }
})

describe('vue-component', () => {
  let provide
  let compiledElement

  beforeEach(() => {
    angular.mock.module('ngVue')

    angular.mock.module($provide => {
      provide = $provide
    })

    inject(($rootScope, $compile) => {
      compiledElement = (html, scope) => {
        scope = scope || $rootScope.$new()
        const elem = angular.element(`<div>${html}</div>`)
        $compile(elem)(scope)
        scope.$digest()
        return elem
      }
    })

    provide.value('HelloComponent', HelloComponent)
  })

  it('should render a vue component with name', () => {
    const elem = compiledElement('<vue-component name="HelloComponent" />')
    expect(elem[0].innerHTML.replace(/\s/g, '')).toBe('<span>Hello</span>')
  })

  it('should render a vue component with properties from scope', inject(($rootScope) => {
    const scope = $rootScope.$new()
    scope.person = { firstName: 'John', lastName: 'Doe' }
    const elem = compiledElement('<vue-component name="HelloComponent" vprops="person" />', scope)
    expect(elem[0].innerHTML).toBe('<span>Hello John Doe</span>')
  }))
})
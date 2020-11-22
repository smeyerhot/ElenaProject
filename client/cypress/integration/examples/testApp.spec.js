describe('CoordinatesTest', () => {
    it('tests that the correct coordinates are sent to the backend', () => {
      cy.visit("https://localhost:3000")
      cy.contains('startPoint')
      cy.get('startPoint').type('42.384594,-72.526805').should('have.value','42.384594,-72.526805')

      cy.contains('endPoint')
      cy.get('endPoint').type('42.390802,-72.529207').show('have.value','42.390802,-72.529207')

      
    })
  })

describe('MinimizeTest', () =>{
    it('tests that minimize is sent to backend when minimize is chosen', () =>{
        cy.visit("https://localhost:3000")
        cy.contains('minMax')
        cy.get('minMax').select('Minimize').should('have.value', 'Minimize')
    })
})

describe('MaximizeTest', () =>{
    it('tests that maximizes is sent to backend when minimize is chosen', () =>{
        cy.visit("https://localhost:3000")
        cy.contains('minMax')
        cy.get('minMax').select('Maximize').should('have.value', 'Maximize')
    })
})

describe('PercentageTest', () =>{
    it('tests that  the correct percentage is sent to backend', () =>{
        cy.visit('https://localhost/3000')
        cy.contains('%')
        c.get('%').type('200').should('have.value', '200')
    })
})


  
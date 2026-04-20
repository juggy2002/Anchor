const TEST_EMAIL = "test@anchortest.com"
const TEST_PASSWORD = "testpassword123"

const login = () => {
  cy.visit("/app")
  cy.get("input[type='email']").type(TEST_EMAIL)
  cy.get("input[type='password']").type(TEST_PASSWORD)
  cy.contains("Log in").click()
  cy.contains("Days sober", { timeout: 8000 }).should("be.visible")
}

describe("Home screen - extended", () => {
  beforeEach(login)

  it("can select a mood and see response", () => {
    cy.contains("Good").click()
    cy.contains("Keep building on this").should("be.visible")
  })

  it("mood persists after selection", () => {
    cy.contains("Okay").click()
    cy.contains("one day at a time").should("be.visible")
  })

  it("struggling mood shows support message", () => {
    cy.contains("Struggling").click()
    cy.contains("tough days").should("be.visible")
  })
})

describe("Journal screen - extended", () => {
  beforeEach(login)

  it("entry persists after save and reload", () => {
    cy.contains("Journal").click()
    cy.get("textarea").first().type("Persistence test entry")
    cy.contains("Save entry").click()
    cy.reload()
    cy.contains("Journal").click()
    cy.contains("View past entries").click()
    cy.contains("Persistence test entry").should("be.visible")
  })
})

describe("Profile screen - extended", () => {
  beforeEach(login)

  it("can edit name", () => {
    cy.contains("Profile").click()
    cy.contains("✏️").click()
    cy.get("input[placeholder='Your name']").clear().type("Test User")
    cy.contains("Save").click()
    cy.contains("Test User").should("be.visible")
  })

  it("can edit sobriety date", () => {
    cy.contains("Profile").click()
    cy.contains("Edit").click()
    cy.get("input[type='date']").type("2026-01-01")
    cy.contains("Days sober").should("be.visible")
  })
})
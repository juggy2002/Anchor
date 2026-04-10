describe("Anchor App", () => {
  const testEmail = "test@anchortest.com"
  const testPassword = "testpassword123"

  it("landing page loads correctly", () => {
    cy.visit("/")
    cy.contains("Anchor").should("be.visible")
    cy.contains("You don't have to do this alone").should("be.visible")
    cy.contains("Get started").should("be.visible")
    cy.contains("Log in").should("be.visible")
  })

  it("landing page sections are present", () => {
    cy.visit("/")
    cy.contains("Everything you need in one place").should("be.visible")
    cy.contains("Built by someone in recovery").should("be.visible")
    cy.contains("What people are saying").should("be.visible")
    cy.contains("Get in touch").should("be.visible")
    cy.contains("Privacy Policy").should("be.visible")
    cy.contains("Terms and Conditions").should("be.visible")
  })

  it("log in button navigates to app", () => {
    cy.visit("/")
    cy.contains("Log in").click()
    cy.url().should("include", "/app")
    cy.contains("Welcome back").should("be.visible")
  })

  it("get started button navigates to app", () => {
    cy.visit("/")
    cy.contains("Get started").click()
    cy.url().should("include", "/app")
  })

  it("login screen has correct fields", () => {
    cy.visit("/app")
    cy.contains("Welcome back").should("be.visible")
    cy.get("input[type='email']").should("be.visible")
    cy.get("input[type='password']").should("be.visible")
    cy.contains("Log in").should("be.visible")
    cy.contains("Don't have an account").should("be.visible")
    cy.contains("Forgot password").should("be.visible")
  })

  it("signup screen has correct fields", () => {
    cy.visit("/app")
    cy.contains("Don't have an account? Sign up").click()
    cy.contains("Create your account").should("be.visible")
    cy.get("input[type='email']").should("be.visible")
    cy.get("input[type='password']").should("be.visible")
    cy.contains("Create account").should("be.visible")
  })

  it("user can log in", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Anchor", { timeout: 8000 }).should("be.visible")
    cy.contains("Days sober").should("be.visible")
  })

  it("home screen shows sobriety counter and milestones", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Days sober", { timeout: 8000 }).should("be.visible")
    cy.contains("Milestones").should("be.visible")
    cy.contains("How are you feeling").should("be.visible")
  })

  it("journal screen loads and can type an entry", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Journal", { timeout: 8000 }).click()
    cy.contains("Today's prompt").should("be.visible")
    cy.get("textarea").first().type("This is a Cypress test entry")
    cy.contains("Save entry").click()
  })

  it("companion screen loads and shows welcome message", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Companion", { timeout: 8000 }).click()
    cy.contains("Here whenever you need support").should("be.visible")
    cy.contains("I'm here").should("be.visible")
  })

  it("resources screen shows UKNA and NHS links", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Resources", { timeout: 8000 }).click()
    cy.contains("UKNA Helpline").should("be.visible")
    cy.contains("0300 999 1212").should("be.visible")
    cy.contains("NHS 111").should("be.visible")
    cy.contains("Talk to Frank").should("be.visible")
  })

  it("profile screen loads with user info", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Profile", { timeout: 8000 }).click()
    cy.contains("Your recovery journey").should("be.visible")
    cy.contains("Days sober").should("be.visible")
    cy.contains("Sign out").should("be.visible")
  })

  it("user can sign out", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(testEmail)
    cy.get("input[type='password']").type(testPassword)
    cy.contains("Log in").click()
    cy.contains("Profile", { timeout: 8000 }).click()
    cy.contains("Sign out").click()
    cy.contains("Welcome back").should("be.visible")
  })
})
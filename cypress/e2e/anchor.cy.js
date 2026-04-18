const TEST_EMAIL = "test@anchortest.com"
const TEST_PASSWORD = "testpassword123"

const login = () => {
  cy.visit("/app")
  cy.get("input[type='email']").type(TEST_EMAIL)
  cy.get("input[type='password']").type(TEST_PASSWORD)
  cy.contains("Log in").click()
  cy.contains("Days sober", { timeout: 8000 }).should("be.visible")
}

describe("Landing page", () => {
  beforeEach(() => cy.visit("/"))

  it("loads with correct hero content", () => {
    cy.contains("Anchor").should("be.visible")
    cy.contains("You don't have to do this alone").should("be.visible")
    cy.contains("Get started").should("be.visible")
    cy.contains("Log in").should("be.visible")
  })

  it("shows all sections", () => {
    cy.contains("Everything you need in one place").should("be.visible")
    cy.contains("Built by someone in recovery").should("be.visible")
    cy.contains("What people are saying").should("be.visible")
    cy.contains("Get in touch").should("be.visible")
    cy.contains("Privacy Policy").should("be.visible")
    cy.contains("Terms and Conditions").should("be.visible")
  })

  it("log in button navigates to app", () => {
    cy.contains("Log in").click()
    cy.url().should("include", "/app")
    cy.contains("Welcome back").should("be.visible")
  })

  it("get started button navigates to app", () => {
    cy.contains("Get started").click()
    cy.url().should("include", "/app")
  })

  it("for providers button navigates to app", () => {
    cy.contains("For providers").click()
    cy.url().should("include", "/app")
  })
})

describe("Authentication", () => {
  it("login screen has correct fields", () => {
    cy.visit("/app")
    cy.contains("Welcome back").should("be.visible")
    cy.get("input[type='email']").should("be.visible")
    cy.get("input[type='password']").should("be.visible")
    cy.contains("Log in").should("be.visible")
    cy.contains("Don't have an account").should("be.visible")
    cy.contains("Forgot password").should("be.visible")
  })

  it("shows back to home button", () => {
    cy.visit("/app")
    cy.contains("Back to home").should("be.visible")
  })

  it("back to home navigates to landing page", () => {
    cy.visit("/app")
    cy.contains("Back to home").click()
    cy.url().should("eq", Cypress.config().baseUrl + "/")
  })

  it("signup screen has correct fields", () => {
    cy.visit("/app")
    cy.contains("Don't have an account? Sign up").click()
    cy.contains("Create your account").should("be.visible")
    cy.get("input[type='email']").should("be.visible")
    cy.get("input[type='password']").should("be.visible")
    cy.contains("Create account").should("be.visible")
  })

  it("user can log in successfully", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type(TEST_EMAIL)
    cy.get("input[type='password']").type(TEST_PASSWORD)
    cy.contains("Log in").click()
    cy.contains("Days sober", { timeout: 8000 }).should("be.visible")
  })

  it("user can sign out", () => {
    login()
    cy.contains("Profile").click()
    cy.contains("Sign out").click()
    cy.contains("Welcome back").should("be.visible")
  })

  it("shows error on invalid credentials", () => {
    cy.visit("/app")
    cy.get("input[type='email']").type("wrong@email.com")
    cy.get("input[type='password']").type("wrongpassword")
    cy.contains("Log in").click()
    cy.contains("Invalid").should("be.visible")
  })
})

describe("Home screen", () => {
  beforeEach(login)

  it("shows sobriety counter", () => {
    cy.contains("Days sober").should("be.visible")
  })

  it("shows milestones section", () => {
    cy.contains("Milestones").should("be.visible")
  })

  it("shows mood check-in", () => {
    cy.contains("How are you feeling").should("be.visible")
  })

  it("can select a mood", () => {
    cy.contains("Good").click()
    cy.contains("Keep building on this").should("be.visible")
  })
})

describe("Journal screen", () => {
  beforeEach(login)

  it("loads journal screen", () => {
    cy.contains("Journal").click()
    cy.contains("Today's prompt").should("be.visible")
  })

  it("can type a journal entry", () => {
    cy.contains("Journal").click()
    cy.get("textarea").first().type("This is a Cypress test entry")
    cy.get("textarea").first().should("have.value", "This is a Cypress test entry")
  })

  it("can select craving level", () => {
    cy.contains("Journal").click()
    cy.contains("None").click()
    cy.contains("None").should("be.visible")
  })

  it("shows strong craving warning", () => {
    cy.contains("Journal").click()
    cy.contains("Strong").click()
    cy.contains("0300 999 1212").should("be.visible")
  })

  it("can save a journal entry", () => {
    cy.contains("Journal").click()
    cy.get("textarea").first().type("Cypress test journal entry")
    cy.contains("Save entry").click()
  })

  it("can view past entries", () => {
    cy.contains("Journal").click()
    cy.contains("View past entries").click()
    cy.contains("Hide past entries").should("be.visible")
  })
})

describe("AI Companion screen", () => {
  beforeEach(login)

  it("loads companion screen", () => {
    cy.contains("Companion").click()
    cy.contains("Here whenever you need support").should("be.visible")
  })

  it("shows welcome message", () => {
    cy.contains("Companion").click()
    cy.contains("I'm here").should("be.visible")
  })

  it("shows suggestion chips", () => {
    cy.contains("Companion").click()
    cy.contains("I'm having a craving").should("be.visible")
    cy.contains("I need a coping strategy").should("be.visible")
  })

  it("can type a message", () => {
    cy.contains("Companion").click()
    cy.get("input[placeholder='Say anything...']").type("Hello")
    cy.get("input[placeholder='Say anything...']").should("have.value", "Hello")
  })
})

describe("Resources screen", () => {
  beforeEach(login)

  it("loads resources screen", () => {
    cy.contains("Resources").click()
    cy.contains("Support is always available").should("be.visible")
  })

  it("shows UKNA helpline", () => {
    cy.contains("Resources").click()
    cy.contains("UKNA Helpline").should("be.visible")
    cy.contains("0300 999 1212").should("be.visible")
  })

  it("shows NHS resources", () => {
    cy.contains("Resources").click()
    cy.contains("NHS 111").should("be.visible")
    cy.contains("Talk to Frank").should("be.visible")
  })

  it("shows coping tools", () => {
    cy.contains("Resources").click()
    cy.contains("Box breathing").should("be.visible")
    cy.contains("5-4-3-2-1 grounding").should("be.visible")
    cy.contains("Urge surfing").should("be.visible")
  })

  it("shows emergency services", () => {
    cy.contains("Resources").click()
    cy.contains("Emergency Services").should("be.visible")
  })
})

describe("Profile screen", () => {
  beforeEach(login)

  it("loads profile screen", () => {
    cy.contains("Profile").click()
    cy.contains("Your recovery journey").should("be.visible")
  })

  it("shows stats", () => {
    cy.contains("Profile").click()
    cy.contains("Days sober").should("be.visible")
    cy.contains("Journal entries").should("be.visible")
    cy.contains("Milestones").should("be.visible")
  })

  it("shows sign out button", () => {
    cy.contains("Profile").click()
    cy.contains("Sign out").should("be.visible")
  })

  it("shows sobriety start date", () => {
    cy.contains("Profile").click()
    cy.contains("Sobriety start date").should("be.visible")
  })

  it("shows notification toggle", () => {
    cy.contains("Profile").click()
    cy.contains("Daily check-in reminder").should("be.visible")
  })
})

describe("Calendar screen", () => {
  beforeEach(login)

  it("opens calendar via icon", () => {
    cy.get("button").contains("📅").click()
    cy.contains("Your mood and milestone history").should("be.visible")
  })

  it("shows mood key", () => {
    cy.get("button").contains("📅").click()
    cy.contains("Mood key").should("be.visible")
  })

  it("can close calendar", () => {
    cy.get("button").contains("📅").click()
    cy.contains("Your mood and milestone history").should("be.visible")
    cy.get("button").contains("✕").click()
    cy.contains("Days sober").should("be.visible")
  })
})

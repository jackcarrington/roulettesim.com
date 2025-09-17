<!-- Powered by BMAD™ Core -->

# Brief Development Agent Task

## Purpose
Mandatory briefing for any agent before development work on roulettesim.com to ensure codebase consistency and convention adherence.

## Process

### Step 1: Load Development Briefing
- Read the complete agent-dev-briefing.md document
- Present key points to the user for confirmation

### Step 2: Agent Acknowledgment
- Agent must explicitly confirm understanding of:
  - CSS variable system (no custom colors/spacing)
  - Component reuse requirements
  - Button class system
  - **MANDATORY MCP usage for Astro docs and shadcn research**
  - Path alias usage
  - Accessibility standards

### Step 3: Development Context
- Ask the user to describe the specific development task
- Confirm the agent understands the requirement
- Identify which existing components/patterns apply

### Step 4: Pre-Development Validation
- Agent confirms they have reviewed relevant existing code
- Agent identifies which CSS variables and components they will use
- Agent commits to following established patterns

### Step 5: Ready State
- Agent confirms "BRIEFING ACKNOWLEDGED" and is ready for development
- User can proceed with confidence that conventions will be followed

## Key Reminders for Agent
- NEVER create custom CSS colors - use root variables only
- ALWAYS use .button class for interactive elements
- CHECK existing components before creating new ones
- **MANDATORY: Use `mcp__astro-docs__search_astro_docs` for Astro implementation guidance**
- **MANDATORY: Use shadcn MCP functions to research component examples before building**
- USE path aliases consistently
- TEST both light and dark modes
- MAINTAIN accessibility standards

## Success Criteria
- Agent demonstrates understanding of codebase conventions
- Agent commits to using established patterns
- User has confidence in consistent implementation
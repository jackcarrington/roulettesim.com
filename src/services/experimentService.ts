// A/B Testing infrastructure for conversion optimization

export interface Experiment {
  id: string;
  name: string;
  variants: string[];
  trafficAllocation: number; // 0-1, percentage of users to include
  active: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface ExperimentAssignment {
  experimentId: string;
  variantId: string;
  assignedAt: Date;
}

class ExperimentService {
  private assignments: Map<string, ExperimentAssignment> = new Map();
  private storageKey = 'experiment_assignments';

  constructor() {
    this.loadAssignments();
  }

  private loadAssignments(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const assignments = JSON.parse(stored);
        this.assignments = new Map(assignments);
      }
    } catch (error) {
      console.warn('Failed to load experiment assignments:', error);
    }
  }

  private saveAssignments(): void {
    try {
      const assignments = Array.from(this.assignments.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(assignments));
    } catch (error) {
      console.warn('Failed to save experiment assignments:', error);
    }
  }

  // Get user's variant for specific experiment
  getVariant(experimentId: string): string | null {
    const assignment = this.assignments.get(experimentId);
    return assignment?.variantId || null;
  }

  // Assign user to experiment variant
  assignToExperiment(experiment: Experiment): string | null {
    if (!experiment.active) return null;
    
    // Check if user already assigned
    const existing = this.assignments.get(experiment.id);
    if (existing) return existing.variantId;

    // Check traffic allocation
    if (Math.random() > experiment.trafficAllocation) {
      return null; // User not included in experiment
    }

    // Randomly assign to variant
    const variantIndex = Math.floor(Math.random() * experiment.variants.length);
    const variantId = experiment.variants[variantIndex];

    const assignment: ExperimentAssignment = {
      experimentId: experiment.id,
      variantId,
      assignedAt: new Date(),
    };

    this.assignments.set(experiment.id, assignment);
    this.saveAssignments();

    return variantId;
  }

  // Track experiment event (conversion, etc.)
  async trackEvent(experimentId: string, eventType: string, eventData?: any): Promise<void> {
    const assignment = this.assignments.get(experimentId);
    if (!assignment) return;

    try {
      await fetch('/api/analytics/experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId,
          variantId: assignment.variantId,
          eventType,
          eventData,
          timestamp: new Date(),
        }),
      });
    } catch (error) {
      console.warn('Failed to track experiment event:', error);
    }
  }

  // Clear assignments (for privacy compliance)
  clearAssignments(): void {
    this.assignments.clear();
    localStorage.removeItem(this.storageKey);
  }
}

// Export singleton instance
export const experimentService = new ExperimentService();

// Predefined experiments for conversion optimization
export const experiments: Record<string, Experiment> = {
  casinoCtaPosition: {
    id: 'casino_cta_position',
    name: 'Casino Recommendation CTA Position',
    variants: ['sidebar', 'bottom', 'floating'],
    trafficAllocation: 0.5, // 50% of users
    active: true,
    startDate: new Date('2025-09-03'),
  },
  
  gameLibraryLayout: {
    id: 'game_library_layout', 
    name: 'Game Library Grid Layout',
    variants: ['3-column', '4-column', 'masonry'],
    trafficAllocation: 0.3, // 30% of users
    active: true,
    startDate: new Date('2025-09-03'),
  },
  
  educationalCtaText: {
    id: 'educational_cta_text',
    name: 'Educational Content CTA Text',
    variants: ['Learn Strategy', 'Master Roulette', 'Get Expert Tips'],
    trafficAllocation: 0.4, // 40% of users
    active: true,
    startDate: new Date('2025-09-03'),
  },
};
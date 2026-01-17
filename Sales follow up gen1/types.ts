
export enum FollowUpScenario {
  PROPOSAL_SENT = "Proposal sent – no response",
  FOLLOW_UP_AFTER_CALL = "Follow-up after call",
  WARM_LEAD_SILENT = "Warm lead went silent",
  NEGOTIATION_PENDING = "Negotiation pending",
  FINAL_FOLLOW_UP = "Final follow-up"
}

export enum Channel {
  EMAIL = "Email",
  WHATSAPP = "WhatsApp"
}

export interface GeneratorState {
  scenario: FollowUpScenario;
  channel: Channel;
}

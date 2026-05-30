import type { OccurrenceStatus } from '../utils/statusLabels';
import type { ResolutionVoteStatus } from './occurrence';

export type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      occurrences: {
        Row: OccurrenceRow;
        Insert: OccurrenceInsert;
        Update: OccurrenceUpdate;
      };
      resolution_votes: {
        Row: ResolutionVoteRow;
        Insert: ResolutionVoteInsert;
        Update: ResolutionVoteUpdate;
      };
      occurrence_reports: {
        Row: OccurrenceReportRow;
        Insert: OccurrenceReportInsert;
        Update: OccurrenceReportUpdate;
      };
      resolution_reports: {
        Row: ResolutionReportRow;
        Insert: ResolutionReportInsert;
        Update: ResolutionReportUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_keep_occurrence: {
        Args: { target_occurrence_id: string; target_notes?: string | null };
        Returns: void;
      };
      admin_cancel_occurrence: {
        Args: { target_occurrence_id: string; target_notes?: string | null };
        Returns: void;
      };
      admin_mark_occurrence_as_duplicated: {
        Args: { target_occurrence_id: string; target_notes?: string | null };
        Returns: void;
      };
      admin_keep_resolution_vote: {
        Args: { target_resolution_vote_id: string; target_notes?: string | null };
        Returns: void;
      };
      admin_cancel_resolution_vote: {
        Args: { target_resolution_vote_id: string; target_notes?: string | null };
        Returns: void;
      };
    };
    Enums: {
      occurrence_status: OccurrenceStatus;
      resolution_vote_status: ResolutionVoteStatus;
      admin_role: 'admin';
    };
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = {
  id: string;
  name: string;
  role: 'admin';
  created_at: string;
};

export type ProfileInsert = {
  id: string;
  name: string;
  role?: 'admin';
  created_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export type OccurrenceRow = {
  id: string;
  category: string;
  title: string;
  description: string;
  photo_path: string;
  photo_url: string | null;
  latitude: number;
  longitude: number;
  reference: string | null;
  neighborhood: string | null;
  status: OccurrenceStatus;
  resolution_votes_count: number;
  reports_count: number;
  anonymous_author_id: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  moderated_at: string | null;
  moderated_by: string | null;
  moderation_notes: string | null;
};

export type OccurrenceInsert = {
  id?: string;
  category: string;
  title: string;
  description: string;
  photo_path: string;
  photo_url?: string | null;
  latitude: number;
  longitude: number;
  reference?: string | null;
  neighborhood?: string | null;
  status?: OccurrenceStatus;
  resolution_votes_count?: number;
  reports_count?: number;
  anonymous_author_id: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string | null;
  moderated_at?: string | null;
  moderated_by?: string | null;
  moderation_notes?: string | null;
};

export type OccurrenceUpdate = Partial<OccurrenceInsert>;

export type ResolutionVoteRow = {
  id: string;
  occurrence_id: string;
  photo_path: string;
  photo_url: string | null;
  note: string | null;
  anonymous_visitor_id: string;
  reports_count: number;
  status: ResolutionVoteStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
};

export type ResolutionVoteInsert = {
  id?: string;
  occurrence_id: string;
  photo_path: string;
  photo_url?: string | null;
  note?: string | null;
  anonymous_visitor_id: string;
  reports_count?: number;
  status?: ResolutionVoteStatus;
  created_at?: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  review_notes?: string | null;
};

export type ResolutionVoteUpdate = Partial<ResolutionVoteInsert>;

export type OccurrenceReportRow = {
  id: string;
  occurrence_id: string;
  reason: string;
  note: string | null;
  anonymous_visitor_id: string;
  created_at: string;
};

export type OccurrenceReportInsert = {
  id?: string;
  occurrence_id: string;
  reason: string;
  note?: string | null;
  anonymous_visitor_id: string;
  created_at?: string;
};

export type OccurrenceReportUpdate = Partial<OccurrenceReportInsert>;

export type ResolutionReportRow = {
  id: string;
  resolution_vote_id: string;
  reason: string;
  note: string | null;
  anonymous_visitor_id: string;
  created_at: string;
};

export type ResolutionReportInsert = {
  id?: string;
  resolution_vote_id: string;
  reason: string;
  note?: string | null;
  anonymous_visitor_id: string;
  created_at?: string;
};

export type ResolutionReportUpdate = Partial<ResolutionReportInsert>;

/**
 * Activity Helpers
 * 
 * Utility functions for handling activity data transformations
 */

import { ActivityItem } from '../types';

type TimelineStatus = 'success' | 'warning' | 'error' | 'neutral';

/**
 * Maps activity type to timeline status
 * @param activityType - The type of activity
 * @returns Timeline status for visual representation
 */
export const getActivityStatus = (activityType: string): TimelineStatus => {
  const statusMap: Record<string, TimelineStatus> = {
    ssl: 'success',
    backup: 'success',
    invoice: 'warning',
    payment: 'success',
    domain: 'neutral',
    server: 'neutral',
    ticket: 'neutral',
    security: 'warning',
    error: 'error',
    maintenance: 'warning',
  };

  return statusMap[activityType] || 'neutral';
};

/**
 * Transforms API activity data to timeline event format
 * @param activities - Array of activity items from API
 * @returns Formatted timeline events
 */
export const transformToTimelineEvents = (activities: ActivityItem[]) => {
  return activities.map((activity) => ({
    id: activity.id,
    title: activity.title,
    description: activity.context,
    timestamp: activity.createdAt || new Date().toLocaleTimeString(),
    status: getActivityStatus(activity.type),
  }));
};

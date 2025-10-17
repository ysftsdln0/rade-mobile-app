import React from 'react';
import { View, StyleSheet, Text, ViewStyle, FlatList } from 'react-native';
import { colors, spacing } from '../../styles';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

interface TimelineProps {
  events: TimelineEvent[];
  style?: ViewStyle;
  testID?: string;
}

/**
 * Timeline Component
 * 
 * Activity history visualization showing a chronological list of events.
 * 
 * Features:
 * - Vertical timeline with connecting line
 * - Status indicators (success, warning, error)
 * - Optional icons
 * - Timestamps
 * - Description support
 * 
 * Status colors:
 * - success: Green (#10B981)
 * - warning: Amber (#F59E0B)
 * - error: Red (#EF4444)
 * - neutral: Gray (#E5E7EB)
 * 
 * @example
 * <Timeline
 *   events={[
 *     {
 *       id: '1',
 *       title: 'Server started',
 *       timestamp: '2 hours ago',
 *       status: 'success'
 *     },
 *     {
 *       id: '2',
 *       title: 'Backup completed',
 *       description: '2.5 GB backed up',
 *       timestamp: '1 hour ago',
 *       status: 'success'
 *     }
 *   ]}
 * />
 */
export const Timeline: React.FC<TimelineProps> = ({
  events,
  style,
  testID,
}) => {
  const renderTimelineEvent = (event: TimelineEvent, index: number) => {
    const isLast = index === events.length - 1;

    return (
      <View key={event.id} style={styles.eventWrapper}>
        {/* Timeline line and dot */}
        <View style={styles.timelineColumn}>
          {/* Connecting line (except for last event) */}
          {!isLast && <View style={styles.timelineConnector} />}

          {/* Status dot */}
          <View
            style={[
              styles.timelineDot,
              styles[`status_${event.status || 'neutral'}`],
            ]}
          >
            {event.icon && (
              <View style={styles.iconInnerContainer}>
                {event.icon}
              </View>
            )}
          </View>
        </View>

        {/* Event content */}
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          {event.description && (
            <Text style={styles.eventDescription}>{event.description}</Text>
          )}
          <Text style={styles.eventTimestamp}>{event.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
    >
      <FlatList
        data={events}
        renderItem={({ item, index }) => renderTimelineEvent(item, index)}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
  },
  eventWrapper: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  timelineColumn: {
    alignItems: 'center',
    marginRight: spacing[3],
  },
  timelineConnector: {
    position: 'absolute',
    width: 2,
    height: 56, // Height from bottom of dot to bottom of container
    backgroundColor: colors.neutral[200],
    top: 32, // Position below the dot
    left: 7, // Center horizontally on the dot
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  status_success: {
    borderColor: colors.semantic.success,
    backgroundColor: colors.semantic.success,
  },
  status_warning: {
    borderColor: colors.semantic.warning,
    backgroundColor: colors.semantic.warning,
  },
  status_error: {
    borderColor: colors.semantic.error,
    backgroundColor: colors.semantic.error,
  },
  status_neutral: {
    borderColor: colors.neutral[300],
    backgroundColor: colors.neutral[300],
  },
  iconInnerContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[1],
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  eventDescription: {
    fontSize: 12,
    color: colors.neutral[600],
    lineHeight: 18,
  },
  eventTimestamp: {
    fontSize: 12,
    color: colors.neutral[500],
    fontWeight: '400',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../utils/theme';

interface TransactionFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'emision', label: 'Emisiones' },
  { key: 'canje', label: 'Canjes' },
  { key: 'bonus', label: 'Bonus' },
];

export const TransactionFilter: React.FC<TransactionFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          onPress={() => onFilterChange(filter.key)}
          style={[
            styles.chip,
            activeFilter === filter.key && styles.chipActive,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              activeFilter === filter.key && styles.chipTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  chipTextActive: {
    color: colors.textPrimary,
  },
});

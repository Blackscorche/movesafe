import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { colors } from '../../utils/theme';

interface OTPInputProps {
  codeLength?: number;
  onCodeFilled: (code: string) => void;
  onCodeChange?: (code: string) => void;
  error?: boolean;
  dark?: boolean;
  value?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  codeLength = 6,
  onCodeFilled,
  onCodeChange,
  error = false,
  dark = false,
  value,
}) => {
  const [code, setCode] = React.useState<string[]>(Array(codeLength).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (value === '') {
      setCode(Array(codeLength).fill(''));
      inputs.current[0]?.focus();
    }
  }, [value, codeLength]);

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < codeLength) {
        inputs.current[index]?.focus();
      }
    },
    [codeLength]
  );

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    const digit = text.replace(/[^0-9]/g, '');
    newCode[index] = digit.slice(-1);
    setCode(newCode);

    onCodeChange?.(newCode.join(''));

    if (digit && index < codeLength - 1) {
      focusInput(index + 1);
    }

    const fullCode = newCode.join('');
    if (fullCode.length === codeLength) {
      onCodeFilled(fullCode);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  return (
    <View style={styles.container}>
      {code.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.inputWrapper,
            dark && styles.inputDark,
            digit && styles.inputFilled,
            error && styles.inputError,
          ]}
        >
          <TextInput
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[styles.input, dark && styles.inputDarkText]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectionColor={colors.primary}
            caretHidden
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  inputWrapper: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputDark: {
    backgroundColor: '#2C2C2C',
    borderColor: '#3A3A3A',
  },
  inputFilled: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    width: '100%',
    height: '100%',
    color: colors.textPrimary,
    fontSize: 24,
  },
  inputDarkText: {
    color: '#FFFFFF',
  },
  inputFilled: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    width: '100%',
    height: '100%',
    color: colors.textPrimary,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    padding: 0,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../components/common';
import { colors, spacing } from '../../styles';
import { useLanguage } from '../../utils/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotScreen = ({ navigation }: any) => {
  const { t } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t.chatbot.greeting,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickReplies = [
    { id: 'billing', label: t.chatbot.billing, icon: 'card-outline' as const },
    { id: 'server', label: t.chatbot.serverStatus, icon: 'server-outline' as const },
    { id: 'troubleshoot', label: t.chatbot.troubleshooting, icon: 'build-outline' as const },
  ];

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    
    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.chatbot.serverIdRequest,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (type: string) => {
    let text = '';
    switch (type) {
      case 'billing':
        text = t.chatbot.needHelpBilling;
        break;
      case 'server':
        text = t.chatbot.checkServerStatus;
        break;
      case 'troubleshoot':
        text = t.chatbot.needTroubleshooting;
        break;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    setIsTyping(true);
    setTimeout(() => {
      let topic = type === 'server' ? 'server status' : type;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.chatbot.botResponse.replace('{topic}', topic),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatarContainer}>
            <Avatar
              initials="RA"
              size="md"
            />
          </View>
          <Text style={styles.headerTitle}>{t.chatbot.title}</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.neutral[900]} />
          </TouchableOpacity>
        </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id}>
            {message.sender === 'bot' && (
              <Text style={styles.botLabel}>{t.chatbot.assistant}</Text>
            )}
            {message.sender === 'user' && (
              <Text style={styles.userLabel}>{t.chatbot.you}</Text>
            )}
            <View
              style={[
                styles.messageRow,
                message.sender === 'user' && styles.messageRowUser,
              ]}
            >
              {message.sender === 'bot' && (
                <View style={styles.avatarWrapper}>
                  <Avatar
                    initials="RA"
                    size="sm"
                  />
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' && styles.userMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              {message.sender === 'user' && (
                <View style={styles.avatarWrapper}>
                  <Avatar
                    initials="YE"
                    size="sm"
                  />
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View>
            <Text style={styles.botLabel}>{t.chatbot.assistant}</Text>
            <View style={styles.messageRow}>
              <View style={styles.avatarWrapper}>
                <Avatar
                  initials="RA"
                  size="sm"
                />
              </View>
              <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                <TypingIndicator />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      <View style={styles.quickRepliesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply.id)}
            >
              <Ionicons name={reply.icon} size={16} color={colors.primary[500]} />
              <Text style={styles.quickReplyText}>{reply.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t.chatbot.askQuestion}
          placeholderTextColor={colors.neutral[400]}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={inputText.trim() === ''}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() === '' ? colors.neutral[400] : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Typing Indicator Component
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Animated.View
        style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]}
      />
      <Animated.View
        style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]}
      />
      <Animated.View
        style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarContainer: {
    marginLeft: spacing[2],
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral[900],
    marginLeft: spacing[3],
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  botLabel: {
    fontSize: 13,
    color: colors.neutral[500],
    marginBottom: spacing[2],
    marginTop: spacing[4],
  },
  userLabel: {
    fontSize: 13,
    color: colors.neutral[500],
    marginBottom: spacing[2],
    marginTop: spacing[4],
    textAlign: 'right',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing[3],
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  avatarWrapper: {
    marginHorizontal: spacing[2],
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#E8EAF6',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    paddingVertical: spacing[2],
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral[900],
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[500],
  },
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingVertical: spacing[3],
  },
  quickRepliesContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  quickReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    marginRight: spacing[2],
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[500],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing[3],
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 24,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: 16,
    color: colors.neutral[900],
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral[200],
    shadowOpacity: 0,
  },
});

export default ChatbotScreen;

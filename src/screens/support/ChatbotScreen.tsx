import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../../components/common";
import { colors, spacing } from "../../styles";
import { useLanguage } from "../../utils/LanguageContext";
import { useTheme } from "../../utils/ThemeContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotScreen = ({ navigation: _navigation }: any) => {
  const { t } = useLanguage();
  const { colors: themeColors, isDark } = useTheme();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t.chatbot.greeting,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickReplies = [
    { id: "billing", label: t.chatbot.billing, icon: "card-outline" as const },
    {
      id: "server",
      label: t.chatbot.serverStatus,
      icon: "server-outline" as const,
    },
    {
      id: "troubleshoot",
      label: t.chatbot.troubleshooting,
      icon: "build-outline" as const,
    },
  ];

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.chatbot.serverIdRequest,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (type: string) => {
    let text = "";
    switch (type) {
      case "billing":
        text = t.chatbot.needHelpBilling;
        break;
      case "server":
        text = t.chatbot.checkServerStatus;
        break;
      case "troubleshoot":
        text = t.chatbot.needTroubleshooting;
        break;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setTimeout(() => {
      const topic = type === "server" ? "server status" : type;
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.chatbot.botResponse.replace("{topic}", topic),
        sender: "bot",
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.surface }]}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: themeColors.surface,
              borderBottomColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.headerAvatarContainer}>
            <Avatar initials="RA" size="md" />
          </View>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            {t.chatbot.title}
          </Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={themeColors.text}
            />
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
              {message.sender === "bot" && (
                <Text
                  style={[
                    styles.botLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {t.chatbot.assistant}
                </Text>
              )}
              {message.sender === "user" && (
                <Text
                  style={[
                    styles.userLabel,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {t.chatbot.you}
                </Text>
              )}
              <View
                style={[
                  styles.messageRow,
                  message.sender === "user" && styles.messageRowUser,
                ]}
              >
                {message.sender === "bot" && (
                  <View style={styles.avatarWrapper}>
                    <Avatar initials="RA" size="sm" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === "user"
                      ? [
                          styles.userBubble,
                          { backgroundColor: themeColors.primary },
                        ]
                      : [
                          styles.botBubble,
                          {
                            backgroundColor: isDark
                              ? themeColors.surfaceAlt
                              : "#E8EAF6",
                          },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.sender === "user"
                            ? "#FFFFFF"
                            : themeColors.text,
                      },
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
                {message.sender === "user" && (
                  <View style={styles.avatarWrapper}>
                    <Avatar initials="YE" size="sm" />
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View>
              <Text
                style={[styles.botLabel, { color: themeColors.textSecondary }]}
              >
                {t.chatbot.assistant}
              </Text>
              <View style={styles.messageRow}>
                <View style={styles.avatarWrapper}>
                  <Avatar initials="RA" size="sm" />
                </View>
                <View
                  style={[
                    styles.messageBubble,
                    styles.botBubble,
                    styles.typingBubble,
                    {
                      backgroundColor: isDark
                        ? themeColors.surfaceAlt
                        : "#E8EAF6",
                    },
                  ]}
                >
                  <TypingIndicator themeColors={themeColors} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Replies */}
        <View
          style={[
            styles.quickRepliesContainer,
            {
              backgroundColor: themeColors.surface,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesContent}
          >
            {quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply.id}
                style={[
                  styles.quickReplyButton,
                  {
                    backgroundColor: isDark
                      ? themeColors.surfaceAlt
                      : "#E3F2FD",
                  },
                ]}
                onPress={() => handleQuickReply(reply.id)}
              >
                <Ionicons
                  name={reply.icon}
                  size={16}
                  color={themeColors.primary}
                />
                <Text
                  style={[
                    styles.quickReplyText,
                    { color: themeColors.primary },
                  ]}
                >
                  {reply.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.surface,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { backgroundColor: themeColors.input, color: themeColors.text },
            ]}
            placeholder={t.chatbot.askQuestion}
            placeholderTextColor={themeColors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() === ""
                    ? themeColors.inputBorder
                    : themeColors.primary,
              },
            ]}
            onPress={handleSend}
            disabled={inputText.trim() === ""}
          >
            <Ionicons
              name="send"
              size={20}
              color={
                inputText.trim() === "" ? themeColors.textTertiary : "#FFFFFF"
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Typing Indicator Component
const TypingIndicator = ({ themeColors }: { themeColors: any }) => {
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
        style={[
          styles.typingDot,
          {
            backgroundColor: themeColors.textSecondary,
            transform: [{ translateY: dot1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            backgroundColor: themeColors.textSecondary,
            transform: [{ translateY: dot2 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.typingDot,
          {
            backgroundColor: themeColors.textSecondary,
            transform: [{ translateY: dot3 }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarContainer: {
    marginLeft: spacing[2],
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: spacing[3],
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: spacing[2],
    marginTop: spacing[4],
  },
  userLabel: {
    fontSize: 13,
    marginBottom: spacing[2],
    marginTop: spacing[4],
    textAlign: "right",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: spacing[3],
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  avatarWrapper: {
    marginHorizontal: spacing[2],
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: 20,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    paddingVertical: spacing[2],
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    paddingVertical: spacing[3],
  },
  quickRepliesContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  quickReplyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: spacing[2],
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    gap: spacing[3],
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default ChatbotScreen;

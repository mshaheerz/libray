"use client";

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

// Register fonts if needed, but standard ones are safer for now
// Font.register({ family: 'IBM Plex Sans', src: '...' });

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#12141D",
    color: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 10,
  },
  logo: {
    width: 30,
    height: 30,
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#8D8D8D",
    marginBottom: 20,
  },
  receiptInfo: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 10,
    color: "#8D8D8D",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#E7C9A5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: "#333c5c",
    paddingBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  gridItem: {
    width: "50%",
    marginBottom: 15,
    paddingRight: 10,
  },
  label: {
    fontSize: 10,
    color: "#8D8D8D",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
  },
  termsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: "#333c5c",
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  term: {
    fontSize: 10,
    color: "#BDBDBD",
    marginBottom: 6,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#8D8D8D",
  },
});

interface Props {
  book: {
    title: string;
    author: string;
    genre: string;
  };
  borrowDate: string;
  dueDate: string;
  receiptId: string;
  userName: string;
}

const Receipt = ({ book, borrowDate, dueDate, receiptId, userName }: Props) => {
  const dateIssued = dayjs().format("MMM DD, YYYY");
  const borrowDateFormatted = dayjs(borrowDate).format("MMM DD, YYYY");
  const dueDateFormatted = dayjs(dueDate).format("MMM DD, YYYY");
  const duration = dayjs(dueDate).diff(dayjs(borrowDate), "day");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>BookWise</Text>
        </View>

        <Text style={styles.title}>Borrow Receipt</Text>

        <View style={styles.receiptInfo}>
          <Text style={styles.infoText}>
            Receipt ID: <Text style={styles.infoValue}>#{receiptId}</Text>
          </Text>
          <Text style={styles.infoText}>
            Date Issued: <Text style={styles.infoValue}>{dateIssued}</Text>
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Book Details</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{book.title}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Author</Text>
            <Text style={styles.value}>{book.author}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{book.genre}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Borrowed on</Text>
            <Text style={styles.value}>{borrowDateFormatted}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={{ ...styles.value, color: "#ef3a4b" }}>
              {dueDateFormatted}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration} Days</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>User</Text>
            <Text style={styles.value}>{userName}</Text>
          </View>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms</Text>
          <Text style={styles.term}>
            • Please return the book by the due date.
          </Text>
          <Text style={styles.term}>
            • Lost or damaged books may incur replacement costs.
          </Text>
          <Text style={styles.term}>
            • Failure to return books on time may result in temporary suspension
            of borrowing privileges.
          </Text>
        </View>

        <Text style={styles.footer}>
          Thank you for using BookWise. For any questions or concerns, please
          contact the library administration.
        </Text>
      </Page>
    </Document>
  );
};

export default Receipt;

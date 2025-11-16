import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function KesehatanTokoScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('30D');

  // Data untuk cards
  const summaryCards = [
    { label: 'Total Omzet', value: 'Rp 80.000.000', color: '#fff', textColor: '#000' },
    { label: 'Uang Cair', value: 'Rp 5000.000', color: '#E8F5E9', textColor: '#4CAF50' },
    { label: 'Uang Pending', value: 'Rp 3000.000', color: '#E3F2FD', textColor: '#2196F3' },
    { label: 'Margin Bersih', value: 'Rp 20.000.000', color: '#F1F8E9', textColor: '#8BC34A' },
  ];

  // Data untuk Line Chart
  const omzetData = [
    { value: 40, label: '02 Apr' },
    { value: 55, label: '06 Apr' },
    { value: 45, label: '14 Apr' },
    { value: 50, label: '13 Apr' },
    { value: 80, label: '14 Apr' },
    { value: 60, label: '18 Apr' },
    { value: 70, label: '21 Apr' },
    { value: 75, label: '23 Apr' },
  ];

  const biayaData = [
    { value: 30, label: '02 Apr' },
    { value: 35, label: '06 Apr' },
    { value: 32, label: '14 Apr' },
    { value: 38, label: '13 Apr' },
    { value: 40, label: '14 Apr' },
    { value: 35, label: '18 Apr' },
    { value: 37, label: '21 Apr' },
    { value: 42, label: '23 Apr' },
  ];

  // Data untuk Pie Chart
  const pieData = [
    { value: 20, color: '#4A90E2', text: '20%', label: 'Biaya Iklan' },
    { value: 8, color: '#E8735C', text: '8%', label: 'Biaya Admin' },
    { value: 10, color: '#50C9A5', text: '10%', label: 'Biaya Affiliate' },
    { value: 40, color: '#F5A623', text: '40%', label: 'Biaya Promo' },
    { value: 6, color: '#9013FE', text: '6%', label: 'Biaya Lain' },
    { value: 16, color: '#BD10E0', text: '16%', label: 'Lainnya' },
  ];

  // Data Pengeluaran Detail
  const pengeluaranDetail = [
    { name: 'Biaya Iklan', percentage: '20%', amount: 'Rp 16.000.000' },
    { name: 'Biaya Admin', percentage: '8%', amount: 'Rp 6.400.00' },
    { name: 'Biaya Affiliate', percentage: '1%', amount: 'Rp 3.000.00' },
    { name: 'Biaya Promo', percentage: '6%', amount: 'Rp 4.800.00' },
    { name: 'Biaya Lain-lain', percentage: '3%', amount: 'Rp 2.400.00' },
  ];

  // Data Bar Chart (Uang Cair vs Pending)
  const barData = [
    { value: 80, label: 'Uang Cair', frontColor: '#4A90E2' },
    { value: 60, label: 'Uang Pending', frontColor: '#50C9A5' },
  ];

  // Status Pengiriman & Klaim
  const statusData = [
    { name: 'Barang Hilang', amount: 'Rp 1.000', status: 'Dianggap' },
    { name: 'Barang Retur', amount: 'Rp 3.000', status: 'Proses' },
    { name: 'Selisih Ongkir', amount: 'Rp 1.000', status: 'Pending' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kesehatan Toko</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScroll}
      >
        {summaryCards.map((card, index) => (
          <View 
            key={index} 
            style={[styles.summaryCard, { backgroundColor: card.color }]}
          >
            <Text style={styles.cardLabel}>{card.label}</Text>
            <Text style={[styles.cardValue, { color: card.textColor }]}>
              {card.value}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Omzet dan Biaya Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Omzet dan Biaya</Text>
          <View style={styles.periodButtons}>
            {['7D', '30D', 'MTD'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodBtn,
                  selectedPeriod === period && styles.periodBtnActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Line Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={omzetData}
            data2={biayaData}
            height={180}
            width={width - 60}
            spacing={40}
            initialSpacing={10}
            color1="#4A90E2"
            color2="#F5A623"
            thickness={3}
            curved
            startFillColor1="rgba(74, 144, 226, 0.2)"
            endFillColor1="rgba(74, 144, 226, 0.05)"
            startFillColor2="rgba(245, 166, 35, 0.2)"
            endFillColor2="rgba(245, 166, 35, 0.05)"
            areaChart
            hideDataPoints={false}
            dataPointsColor1="#4A90E2"
            dataPointsColor2="#F5A623"
            dataPointsRadius={4}
            xAxisColor="#E0E0E0"
            yAxisColor="#E0E0E0"
            yAxisTextStyle={{ color: '#888', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#888', fontSize: 9 }}
            noOfSections={4}
            maxValue={100}
          />
          
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
              <Text style={styles.legendText}>Omzet</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F5A623' }]} />
              <Text style={styles.legendText}>Biaya</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Pengeluaran Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengeluaran</Text>
        
        <View style={styles.pengeluaranContainer}>
          {/* Pie Chart */}
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              radius={70}
              innerRadius={45}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>Total</Text>
                  <Text style={styles.centerLabelValue}>100%</Text>
                </View>
              )}
            />
          </View>

          {/* Pengeluaran Details */}
          <View style={styles.pengeluaranDetails}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailHeaderText}>Petengikuma</Text>
              <Text style={styles.detailHeaderText}>Persentage</Text>
            </View>
            {pengeluaranDetail.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailName}>{item.name}</Text>
                <Text style={styles.detailPercentage}>{item.percentage}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Biaya</Text>
              <Text style={styles.totalValue}>Rp 38.000.000</Text>
            </View>
          </View>
        </View>

        {/* Pengeluaran Amounts */}
        <View style={styles.amountsContainer}>
          <View style={styles.amountHeader}>
            <Text style={styles.amountHeaderText}>Petengikuma</Text>
            <Text style={styles.amountHeaderText}>Rp</Text>
          </View>
          {pengeluaranDetail.map((item, index) => (
            <View key={index} style={styles.amountRow}>
              <Text style={styles.amountName}>{item.name}</Text>
              <Text style={styles.amountValue}>{item.amount}</Text>
            </View>
          ))}
          <View style={styles.totalAmountRow}>
            <Text style={styles.totalAmountLabel}>Total Biaya</Text>
            <Text style={styles.totalAmountValue}>Rp 38.000.000</Text>
          </View>
        </View>
      </View>

      {/* Uang Cair vs Pending */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uang Cair vs Pending</Text>
        
        <View style={styles.barChartContainer}>
          <View style={styles.barChart}>
            {barData.map((item, index) => (
              <View key={index} style={styles.barItem}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${item.value}%`, 
                        backgroundColor: item.frontColor 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Status Pengiriman & Klaim */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Pengiriman & Klaim</Text>
        
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Harang-kos</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Total Ratulia</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>T'stu</Text>
          </View>
          
          {statusData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.name}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.amount}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.status}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },

  // Summary Cards
  cardsScroll: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  summaryCard: {
    width: 140,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    flexWrap: 'wrap',
  },

  // Section
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
  },
  periodBtnActive: {
    backgroundColor: '#4A90E2',
  },
  periodText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },

  // Chart Container
  chartContainer: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  // Pengeluaran
  pengeluaranContainer: {
    flexDirection: 'column',
    gap: 15,
    marginBottom: 15,
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 10,
    color: '#666',
  },
  centerLabelValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  pengeluaranDetails: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailHeaderText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailName: {
    fontSize: 11,
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  detailPercentage: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },

  // Amounts Container
  amountsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  amountHeaderText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  amountName: {
    fontSize: 11,
    color: '#333',
    flex: 1,
    paddingRight: 10,
  },
  amountValue: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  totalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalAmountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  totalAmountValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },

  // Bar Chart
  barChartContainer: {
    paddingVertical: 15,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
  },
  barItem: {
    alignItems: 'center',
    width: 90,
  },
  barWrapper: {
    height: 160,
    width: 50,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 11,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Table
  tableContainer: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
  },
});
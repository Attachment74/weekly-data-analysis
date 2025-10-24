import * as XLSX from 'xlsx';

export interface WeeklyData {
  month: string;
  date: string;
  totalEnergyGenerated: number;
  maxGhanaDemand: number;
  maxDomesticDemand: number;
  averageDemand: number;
  loadFactor: number;
  availability69KV: number;
  availability161KV: number;
  availability225KV: number;
  availability330KV: number;
  worstStation: string;
  worstFeeder: string;
  worstFeederAvailability: number;
  ecgAvailabilityIncludingPlanned: number;
  ecgAvailabilityExcludingPlanned: number;
  nedcoAvailabilityIncludingPlanned: number;
  nedcoAvailabilityExcludingPlanned: number;
  frequencyWithinRange: number;
  frequencyOutsideRange: number;
  frequencyBenchmark: number;
}

export const parseExcelFile = async (file: File): Promise<WeeklyData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Find the header row (row with column names)
        const headerRowIndex = jsonData.findIndex((row: any) => 
          row.includes('DATE') || row.includes('Months')
        );
        
        if (headerRowIndex === -1) {
          throw new Error('Could not find header row in Excel file');
        }
        
        const headers = jsonData[headerRowIndex] as string[];
        const dataRows = jsonData.slice(headerRowIndex + 1) as any[][];
        
        console.log('Headers found:', headers);
        console.log('First data row:', dataRows[0]);
        console.log('Sample parsed values:', {
          month: dataRows[0]?.[0],
          date: dataRows[0]?.[1],
          totalEnergyGenerated: dataRows[0]?.[2],
          maxGhanaDemand: dataRows[0]?.[3],
        });
        
        const parsedData: WeeklyData[] = dataRows
          .filter(row => row && row.length > 0 && row[1]) // Filter out empty rows
          .map(row => ({
            month: String(row[0] || ''),
            date: String(row[1] || ''),
            totalEnergyGenerated: parseFloat(row[2]) || 0,
            maxGhanaDemand: parseFloat(row[3]) || 0,
            maxDomesticDemand: parseFloat(row[4]) || 0,
            averageDemand: parseFloat(row[5]) || 0,
            loadFactor: parseFloat(row[6]) || 0,
            availability69KV: parseFloat(row[7]) || 0,
            availability161KV: parseFloat(row[8]) || 0,
            availability225KV: parseFloat(row[9]) || 0,
            availability330KV: parseFloat(row[10]) || 0,
            worstStation: String(row[11] || ''),
            worstFeeder: String(row[12] || ''),
            worstFeederAvailability: parseFloat(row[13]) || 0,
            ecgAvailabilityIncludingPlanned: parseFloat(row[14]) || 0,
            ecgAvailabilityExcludingPlanned: parseFloat(row[15]) || 0,
            nedcoAvailabilityIncludingPlanned: parseFloat(row[16]) || 0,
            nedcoAvailabilityExcludingPlanned: parseFloat(row[17]) || 0,
            frequencyWithinRange: parseFloat(row[18]) || 0,
            frequencyOutsideRange: parseFloat(row[19]) || 0,
            frequencyBenchmark: parseFloat(row[20]) || 0,
          }));
        
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const calculateKPIs = (data: WeeklyData[]) => {
  if (data.length === 0) return null;
  
  const latestWeek = data[data.length - 1];
  const previousWeek = data.length > 1 ? data[data.length - 2] : latestWeek;
  
  const avgFrequencyWithinRange = data.reduce((sum, d) => sum + d.frequencyWithinRange, 0) / data.length;
  const avgSystemAvailability = data.reduce((sum, d) => 
    sum + (d.availability69KV + d.availability161KV + d.availability225KV + d.availability330KV) / 4, 0
  ) / data.length;
  
  return {
    peakDemand: {
      value: latestWeek.maxGhanaDemand,
      change: ((latestWeek.maxGhanaDemand - previousWeek.maxGhanaDemand) / previousWeek.maxGhanaDemand * 100),
      trend: (latestWeek.maxGhanaDemand > previousWeek.maxGhanaDemand ? 'up' : 'down') as 'up' | 'down'
    },
    totalGeneration: {
      value: latestWeek.totalEnergyGenerated,
      change: ((latestWeek.totalEnergyGenerated - previousWeek.totalEnergyGenerated) / previousWeek.totalEnergyGenerated * 100),
      trend: (latestWeek.totalEnergyGenerated > previousWeek.totalEnergyGenerated ? 'up' : 'down') as 'up' | 'down'
    },
    gridStability: {
      value: avgFrequencyWithinRange,
      status: (avgFrequencyWithinRange >= 80 ? 'stable' : avgFrequencyWithinRange >= 60 ? 'moderate' : 'critical') as 'stable' | 'moderate' | 'critical'
    },
    systemAvailability: {
      value: avgSystemAvailability,
      status: (avgSystemAvailability >= 99 ? 'stable' : avgSystemAvailability >= 95 ? 'moderate' : 'critical') as 'stable' | 'moderate' | 'critical'
    }
  };
};

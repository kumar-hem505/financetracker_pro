import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generates financial insights and analysis using Gemini AI
 * @param {string} prompt - The financial query or data analysis request
 * @param {Object} financialData - Optional financial context data
 * @returns {Promise<string>} AI-generated insights
 */
export async function generateFinancialInsights(prompt, financialData = null) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    let contextPrompt = prompt;
    
    if (financialData) {
      contextPrompt = `
        Based on the following financial data: ${JSON.stringify(financialData, null, 2)}
        
        Query: ${prompt}
        
        Please provide insights in Indian Rupees (₹) format and consider Indian business context.
        Keep the response concise and actionable.
      `;
    }
    
    const result = await model?.generateContent(contextPrompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new Error('Failed to generate AI insights. Please try again.');
  }
}

/**
 * Analyzes invoice/receipt image and extracts financial data
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Extracted financial data
 */
export async function analyzeInvoiceImage(imageFile) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Convert image to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
      });

    const imageBase64 = await toBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: imageFile?.type,
      },
    };

    const prompt = `
      Analyze this invoice/receipt image and extract the following information in JSON format:
      {
        "vendor_name": "string",
        "amount": "number (without currency symbol)",
        "invoice_number": "string",
        "date": "YYYY-MM-DD format",
        "gst_amount": "number (if mentioned)",
        "description": "string (brief description of items/services)",
        "payment_mode": "string (if mentioned)",
        "category": "string (suggested category like office supplies, travel, etc.)"
      }
      
      Focus on Indian invoice formats and GST details. If any field is not found, use null.
    `;

    const result = await model?.generateContent([prompt, imagePart]);
    const response = await result?.response;
    const text = response?.text();
    
    // Try to parse JSON from response
    try {
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON from AI response:', parseError);
    }
    
    // Return a fallback object if parsing fails
    return {
      description: 'Invoice analysis completed',
      extracted_text: text
    };
  } catch (error) {
    console.error('Error analyzing invoice image:', error);
    throw new Error('Failed to analyze invoice. Please try again.');
  }
}

/**
 * Generates financial forecasts and predictions
 * @param {Array} historicalData - Historical transaction data
 * @param {string} period - Forecast period (3months, 6months, 12months)
 * @returns {Promise<Object>} Forecast data
 */
export async function generateFinancialForecast(historicalData, period = '6months') {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Analyze the following financial transaction data and provide a ${period} forecast:
      ${JSON.stringify(historicalData, null, 2)}
      
      Please provide a forecast in the following JSON format:
      {
        "forecast_period": "${period}",
        "predicted_income": number,
        "predicted_expenses": number,
        "predicted_cash_flow": number,
        "key_trends": ["trend1", "trend2", "trend3"],
        "recommendations": ["rec1", "rec2", "rec3"],
        "risk_factors": ["risk1", "risk2"],
        "confidence_level": "high/medium/low"
      }
      
      Use Indian Rupees context and consider seasonal business patterns in India.
    `;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    try {
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse forecast JSON:', parseError);
    }
    
    return {
      forecast_period: period,
      analysis: text,
      confidence_level: 'medium'
    };
  } catch (error) {
    console.error('Error generating financial forecast:', error);
    throw new Error('Failed to generate forecast. Please try again.');
  }
}

/**
 * Detects financial anomalies and unusual patterns
 * @param {Array} transactions - Recent transactions
 * @returns {Promise<Array>} Detected anomalies
 */
export async function detectFinancialAnomalies(transactions) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Analyze these financial transactions for anomalies or unusual patterns:
      ${JSON.stringify(transactions, null, 2)}
      
      Look for:
      1. Unusual spending spikes
      2. Duplicate transactions
      3. Irregular payment patterns
      4. Budget threshold breaches
      5. Unusual vendor activity
      
      Return results as JSON array:
      [
        {
          "type": "anomaly_type",
          "severity": "high/medium/low",
          "description": "description of anomaly",
          "transaction_id": "id if applicable",
          "suggestion": "recommended action"
        }
      ]
    `;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    try {
      const jsonMatch = text?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse anomalies JSON:', parseError);
    }
    
    return [];
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    return [];
  }
}

/**
 * Provides tax optimization suggestions
 * @param {Object} financialSummary - Summary of financial data
 * @returns {Promise<Array>} Tax optimization tips
 */
export async function getTaxOptimizationTips(financialSummary) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Based on this financial summary, provide Indian tax optimization suggestions:
      ${JSON.stringify(financialSummary, null, 2)}
      
      Focus on:
      1. GST optimization
      2. TDS savings
      3. Business expense deductions
      4. Investment opportunities
      5. Compliance improvements
      
      Return as JSON array of actionable tips:
      [
        {
          "category": "gst/tds/deductions/investment",
          "tip": "specific actionable advice",
          "potential_savings": "estimated savings amount in INR",
          "implementation": "how to implement this tip"
        }
      ]
      
      Consider current Indian tax laws and rates.
    `;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const text = response?.text();
    
    try {
      const jsonMatch = text?.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse tax tips JSON:', parseError);
    }
    
    return [{
      category: 'general',
      tip: 'Review your financial data for tax optimization opportunities',
      potential_savings: 'Varies',
      implementation: text
    }];
  } catch (error) {
    console.error('Error getting tax optimization tips:', error);
    return [];
  }
}

export default genAI;
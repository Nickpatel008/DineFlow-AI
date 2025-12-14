import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateItemDescription = async (itemName: string, category: string): Promise<string> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Fallback description if API key not configured
      return `A delicious ${itemName} from our ${category} selection. Made with fresh ingredients and served with care.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative restaurant menu writer. Write appetizing, concise menu item descriptions (2-3 sentences max) that highlight flavors and appeal to customers.'
        },
        {
          role: 'user',
          content: `Write a creative, appetizing description for a menu item called "${itemName}" in the "${category}" category.`
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    });

    return completion.choices[0]?.message?.content || `A delicious ${itemName} from our ${category} selection.`;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return `A delicious ${itemName} from our ${category} selection. Made with fresh ingredients and served with care.`;
  }
};

export const generateOfferDescription = async (
  restaurantName: string,
  category: string,
  discount: number
): Promise<string> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return `Special ${discount}% discount on ${category} items at ${restaurantName}!`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a marketing copywriter for restaurants. Write compelling, short promotional offers (1-2 sentences) that create urgency and excitement.'
        },
        {
          role: 'user',
          content: `Create a promotional offer description for ${restaurantName}: ${discount}% discount on ${category} items.`
        }
      ],
      max_tokens: 100,
      temperature: 0.9
    });

    return completion.choices[0]?.message?.content || `Special ${discount}% discount on ${category} items!`;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return `Special ${discount}% discount on ${category} items!`;
  }
};

export const generateBusinessInsights = async (
  restaurantName: string,
  stats: {
    totalOrders: number;
    totalRevenue: number;
    popularItems: string[];
    averageOrderValue: number;
  }
): Promise<string> => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return `Business Summary: ${stats.totalOrders} orders processed, generating $${stats.totalRevenue.toFixed(2)} in revenue.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst for restaurants. Provide concise, actionable insights based on restaurant data (2-3 sentences).'
        },
        {
          role: 'user',
          content: `Analyze this restaurant data and provide insights: Restaurant: ${restaurantName}, Total Orders: ${stats.totalOrders}, Total Revenue: $${stats.totalRevenue}, Popular Items: ${stats.popularItems.join(', ')}, Average Order Value: $${stats.averageOrderValue.toFixed(2)}.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || `Business Summary: ${stats.totalOrders} orders processed.`;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return `Business Summary: ${stats.totalOrders} orders processed, generating $${stats.totalRevenue.toFixed(2)} in revenue.`;
  }
};
















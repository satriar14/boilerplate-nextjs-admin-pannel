import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};


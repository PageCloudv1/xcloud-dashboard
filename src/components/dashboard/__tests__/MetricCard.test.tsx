import { render, screen } from '@testing-library/react';
import MetricCard from '../MetricCard';

describe('MetricCard', () => {
  it('renders metric card with title and value', () => {
    render(<MetricCard title="Test Metric" value="100" icon="🎯" />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('displays upward trend correctly', () => {
    render(<MetricCard title="Test" value="50" icon="📊" trend="+10%" trendUp />);

    const trendElement = screen.getByText(/\+10%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('text-green-600');
  });

  it('displays downward trend correctly', () => {
    render(<MetricCard title="Test" value="50" icon="📊" trend="-5%" trendUp={false} />);

    const trendElement = screen.getByText(/-5%/);
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('text-red-600');
  });
});

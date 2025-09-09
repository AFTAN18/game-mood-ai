import { render, screen, fireEvent, act } from '@testing-library/react';
import { VoiceToneAnalyzer } from '../VoiceToneAnalyzer';

// Mock the Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn().mockReturnValue({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn(),
    connect: jest.fn(),
  }),
  createMediaStreamSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
  }),
  close: jest.fn(),
  sampleRate: 44100,
}));

describe('VoiceToneAnalyzer', () => {
  const mockOnToneDetected = jest.fn();
  
  beforeEach(() => {
    // Mock getUserMedia
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
      },
      writable: true,
    });
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    render(<VoiceToneAnalyzer onToneDetected={mockOnToneDetected} isActive={true} />);
    expect(screen.getByText('Voice Tone Analysis')).toBeInTheDocument();
  });

  it('requests microphone access when start button is clicked', async () => {
    render(<VoiceToneAnalyzer onToneDetected={mockOnToneDetected} isActive={true} />);
    
    const button = screen.getByRole('button', { name: /mic/i });
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
  });

  it('updates UI when voice is detected', async () => {
    render(<VoiceToneAnalyzer onToneDetected={mockOnToneDetected} isActive={true} />);
    
    // Mock the analyzer data
    const mockDataArray = new Uint8Array(128);
    mockDataArray.fill(100); // Simulate some audio data
    
    // Call the analyze function directly
    const { analyzeAudio } = require('../VoiceToneAnalyzer');
    analyzeAudio();
    
    // Verify the callback was called with expected values
    expect(mockOnToneDetected).toHaveBeenCalled();
  });
});

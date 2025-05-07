import { useState } from 'react';
import { StepStatus } from '../types';

export const useTutorial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [stepStatus, setStepStatus] = useState<StepStatus[]>([
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
  ]);

  const updateStepStatus = (
    stepIndex: number,
    loading: boolean,
    result: string,
    resultType: StepStatus['resultType']
  ) => {
    setStepStatus(prev => {
      const newStatus = [...prev];
      newStatus[stepIndex] = {
        ...newStatus[stepIndex],
        loading,
        result,
        resultType,
      };
      return newStatus;
    });
  };

  const completeStep = (stepIndex: number, isFinalStep = false) => {
    setStepStatus(prev => {
      const newStatus = [...prev];
      newStatus[stepIndex] = {
        ...newStatus[stepIndex],
        completed: true,
        loading: false,
      };
      return newStatus;
    });

    if (!isFinalStep) {
      setActiveStep(stepIndex + 1);
    }
  };

  const resetTutorial = () => {
    setActiveStep(0);
    setStepStatus([
      { completed: false, loading: false, result: '', resultType: '' },
      { completed: false, loading: false, result: '', resultType: '' },
      { completed: false, loading: false, result: '', resultType: '' },
      { completed: false, loading: false, result: '', resultType: '' },
    ]);
  };

  return {
    activeStep,
    stepStatus,
    updateStepStatus,
    completeStep,
    resetTutorial,
  };
}; 
'use client'

import { useState } from 'react'
import { Step1 } from './step-1'
import { Step2, type Step2Payload } from './step-2'
import { Step3Custom, type Step3Payload } from './step-3'
import { Step4 } from './step-4'

type Step =
  | '1-welcoming-screen'
  | '2-variant-select'
  | '3-custom-toppings-select'
  | '4-cooking'

type PizzaState = {
  step1: boolean
  step2?: Step2Payload
  step3?: Step3Payload
}

export function StepController() {
  const [step, setStep] = useState<Step>('1-welcoming-screen')
  const [pizzaState, setPizzaState] = useState<PizzaState>({
    step1: false,
  })

  const onReset = () => {
    setPizzaState({ step1: false })
    setStep('1-welcoming-screen')
  }

  const handleStep1Click = () => {
    setPizzaState((prev) => ({ ...prev, step1: true }))
    setStep('2-variant-select')
  }

  const handleStep2Click = (payload: Step2Payload) => {
    setPizzaState((prev) => ({ ...prev, step2: payload }))
    if (payload.type === 'custom') {
      setStep('3-custom-toppings-select')
    } else {
      setStep('4-cooking')
    }
  }

  const handleStep3Click = (payload: Step3Payload) => {
    setPizzaState((prev) => ({ ...prev, step3: payload }))
    setStep('4-cooking')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {step === '1-welcoming-screen' && <Step1 onClick={handleStep1Click} />}
        {step === '2-variant-select' && <Step2 onClick={handleStep2Click} />}
        {step === '3-custom-toppings-select' && (
          <Step3Custom onSubmit={handleStep3Click} />
        )}
        {step === '4-cooking' && (
          <Step4
            state={pizzaState as unknown as Required<PizzaState>}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  )
}

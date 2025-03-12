import React, { useState } from 'react';
import { Calculator, RefreshCw } from 'lucide-react';
import BigNumber from 'bignumber.js';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  // Normaliza el número con BigNumber
  const normalizeNumber = (value) => {
    const cleanInput = value.replace(/[$\s]/g, '');

    const formatWithDot = /^\d{1,3}(\.\d{3})*,\d*$/.test(cleanInput); 
    const formatWithComma = /^\d{1,3}(,\d{3})*\.\d*$/.test(cleanInput); 
    const onlyDots = /^\d{1,3}(\.\d{3})*$/.test(cleanInput); 
    const onlyCommas = /^\d{1,3}(,\d{3})*$/.test(cleanInput); 

    let processedNumber;

    if (formatWithDot) {
      processedNumber = cleanInput.replace(/\./g, '').replace(',', '.');
    } else if (formatWithComma) {
      processedNumber = cleanInput.replace(/,/g, '');
    } else if (onlyDots) {
      processedNumber = cleanInput.replace(/\./g, '');
    } else if (onlyCommas) {
      processedNumber = cleanInput.replace(/,/g, '');
    } else if (cleanInput.includes(',')) {
      processedNumber = cleanInput.replace(',', '.');
    } else {
      processedNumber = cleanInput;
    }

    const number = new BigNumber(processedNumber);
    if (!number.isNaN()) {
      return number.decimalPlaces(2, BigNumber.ROUND_HALF_UP);
    }
    return number;
  };

  // Convierte números a palabras
  const numberToWords = (num) => {
    const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (num.isZero()) return '';
    if (num.eq(100)) return 'cien';

    const BN = BigNumber;
    if (num.gte(1e15)) {
      const quintillions = num.div(1e15).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(1e15);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${numberToWords(quintillions)} ${quintillions.eq(1) ? 'quintillón' : 'quintillones'}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(1e12)) {
      const trillions = num.div(1e12).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(1e12);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${numberToWords(trillions)} ${trillions.eq(1) ? 'trillón' : 'trillones'}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(1e9)) {
      const billions = num.div(1e9).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(1e9);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${numberToWords(billions)} ${billions.eq(1) ? 'billón' : 'billones'}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(1e6)) {
      const millions = num.div(1e6).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(1e6);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${millions.eq(1) ? 'un millón' : `${numberToWords(millions)} millones`}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(1000)) {
      const thousands = num.div(1000).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(1000);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${thousands.eq(1) ? 'mil' : `${numberToWords(thousands)} mil`}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(100)) {
      const hundred = num.div(100).integerValue(BN.ROUND_FLOOR);
      const remainder = num.mod(100);
      const remainderWords = remainder.isZero() ? '' : numberToWords(remainder);
      return `${hundreds[hundred.toNumber()]}${remainderWords ? ' ' + remainderWords : ''}`;
    }
    if (num.gte(20)) {
      const ten = num.div(10).integerValue(BN.ROUND_FLOOR);
      const unit = num.mod(10);
      return `${tens[ten.toNumber()]}${unit.gt(0) ? (ten.eq(2) ? 'i' : ' y ') + units[unit.toNumber()] : ''}`;
    }
    if (num.gte(10)) return teens[num.minus(10).toNumber()];
    return units[num.toNumber()];
  };

  // Convierte el número completo (entero + decimal)
  const convertToWords = (number) => {
    if (number.isNaN()) return 'Ingresa un número válido';
    const integer = number.integerValue(BigNumber.ROUND_FLOOR);
    const decimalFraction = number.minus(integer);
    const decimal = decimalFraction.times(100).integerValue(BigNumber.ROUND_FLOOR);
    
    const integerWords = integer.isZero() ? 'cero' : numberToWords(integer);
    const decimalWords = ` con ${decimal.isZero() ? 'cero' : numberToWords(decimal)} centésimos`;
    
    return `${integerWords}${decimalWords}`.trim();
  };

  // Maneja la conversión al presionar "Convertir"
  const handleConvert = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setResult('Ingresa un número para convertir');
      setIsConverted(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const normalized = normalizeNumber(input);
      console.log("Número normalizado:", normalized.toString()); // Para depuración
      const words = convertToWords(normalized);
      setResult(words.charAt(0).toUpperCase() + words.slice(1));
      setLoading(false);
      setIsConverted(true);
    }, 300);
  };

  // Limpia todo y restablece el estado
  const handleReset = () => {
    setInput('');
    setResult('');
    setIsConverted(false);
  };

  const formatExamples = ['$2.050.300,56', '2.050.300,56', '2050300.56', '2,050,300.56'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
        <div className="py-6 px-6 bg-emerald-600 text-white text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Calculator className="w-6 h-6" />
            Convertidor de Números a Letras
          </h1>
          <p className="text-emerald-100 mt-1">Convierte números con un clic</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleConvert}>
            <div className="mb-4">
              <label htmlFor="numberInput" className="block text-sm font-medium text-gray-700 mb-1">
                Ingresa un número:
              </label>
              <input
                id="numberInput"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: $2.050.300,56"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  'Convertir'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isConverted
                    ? 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 focus:ring-gray-500'
                }`}
              >
                Limpiar
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm text-emerald-800 font-medium mb-1">Resultado:</p>
              <p className="text-xl font-semibold text-emerald-900 break-words">{result}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Ejemplos de formatos aceptados:</p>
            <div className="flex flex-wrap gap-2">
              {formatExamples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(example)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-gray-500 absolute bottom-2">
        © 2025 Convertidor de Números | Creado con React, Vite y Tailwind CSS v4.0
      </div>
    </div>
  );
}

export default App;

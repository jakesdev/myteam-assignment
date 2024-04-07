import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsService {

  jsonInputHandler(jsonData) {
    const result = jsonData.map(data => {

      const computed = this.isValidTransaction(data);
      return {
        "transaction": data.transaction,
        "transformations": data.transformations,
        "balance": computed.balance,
        "isValid": computed.isValid ,
        "errorReason": computed.errorReasons
      };
    })
    return result;
  }

  isValidTransaction(transaction) {
    const sourceSizes = [];
    const childSizes = [];
    const errorReasons = [];
    for (const transformation of transaction.transformations) {
      if (transformation.qty < 0) {
        sourceSizes.push({size: transformation.size,qty: transformation.qty});
      } else {
        childSizes.push({ size: transformation.size, qty: transformation.qty });
      }
    }

    const balance = transaction.transformations.reduce((acc, curr) => {
        return acc + (curr.qty * curr.size);
    }, 0);

    const sourceTotal = sourceSizes.reduce((acc, timber) => acc + (timber.size * timber.qty), 0);
    const childTotal = childSizes.reduce((acc, timber) => acc + (timber.size * timber.qty), 0);

    // Check if source part number matches child part numbers
    if (childTotal + sourceTotal !== 0) {
      errorReasons.push("Source part number should match child part numbers");
    }

    // Check child part lengths
    // Case 1: Child part in range of increments of 0.3
    for (let i = 0; i < childSizes.length - 1; i++) {
      if (childSizes[i].size < 3 || childSizes[i].size > 12) {
        errorReasons.push("Child part length should be between 3 and 12 meters");
      }
      if (transaction.transaction === "8b5431075a9cdc1ed94f000d8b05bb6a") {
        console.log(childSizes[i])
        console.log(childSizes[i].size * 10 % 3);
      }
      if (childSizes[i].size * 10 % 3 !== 0) {
        errorReasons.push("Child part length should be in increments of 0.3 meters");
      }
    }

    // Case 2: Child part in range of 3 to 12, each part should be have 0.3 increments
    // const childSizesSorted = childSizes.map(item => item.size).sort((a, b) => a - b);
    // for (let i = 0; i < childSizesSorted.length - 1; i++) {
    //   if (childSizesSorted[i] < 3 || childSizesSorted[i] > 12) {
    //     errorReasons.push("Child part length should be between 3 and 12 meters");
    //   }
    //   if (childSizesSorted[i] !== childSizesSorted[i + 1] && childSizesSorted[i] + 0.3 === childSizesSorted[i + 1]) {
    //     errorReasons.push("Child part length should be in increments of 0.3 meters");
    //   } 
    // }
    return {
      balance: sourceTotal + childTotal,
      isValid: errorReasons.length === 0,
      errorReasons: errorReasons.filter((item, index) => errorReasons.indexOf(item) === index)

    };
  }
}

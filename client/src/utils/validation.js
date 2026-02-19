export function validateLedger(data) {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = '* 제목을 입력해주세요.';
  }

  if (!data.description?.trim()) {
    errors.description = '* 내용을 입력해주세요';
  }

  return errors;
}

export function validateTransaction(data) {
  const errors = {};

  if (!data.amount || data.amount <= 0) {
    errors.amount = '* 금액을 입력해주세요';
  }
  if (!data.category?.trim()) {
    errors.category = '* 카테고리를 입력해주세요';
  }
  if (!data.description?.trim()) {
    errors.description = '* 내용을 입력해주세요';
  }
  if (!data.date) {
    errors.date = '* 날짜를 선택해주세요';
  }

  return errors;
}

/**
 * 4자리 연도 문자열을 파싱합니다.
 * - 공백을 제거한 뒤 정확히 4자리 숫자인 경우에만 유효한 연도로 인식합니다.
 * - 유효하지 않으면 null을 반환합니다.
 *
 * @param value 4자리 연도 문자열(예: "1999"). null 허용
 * @returns 파싱된 연도(0~9999) 또는 null
 */
export function parseFourDigitYear(
  value: string | null,
): number | null {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (/^\d{4}$/.test(trimmed)) {
    const year = Number(trimmed);
    if (year >= 0 && year <= 9999) return year;
  }
  return null;
}

/**
 * 발행년도 문자열의 맨 앞 4자리를 사용해 연도를 추출합니다.
 * - 문자열 길이가 4 미만이거나, 앞 4자리가 숫자 4자리가 아니면 null을 반환합니다.
 *
 * @param publishYear 발행년도 원본 문자열(예: "20080401", "2008-04-01"). null 허용
 * @returns 파싱된 연도 또는 null
 */
export function extractPublishYear(
  publishYear: string | null,
): number | null {
  if (!publishYear) return null;
  const s = String(publishYear).trim();
  if (s.length < 4) return null;
  const first4 = s.slice(0, 4);
  if (/^\d{4}$/.test(first4)) {
    return Number(first4);
  }
  return null;
}

/**
 * 저작권 존재 여부를 규칙에 따라 판단합니다.
 * 반환값 의미:
 * - true: 저작권이 있다고 판단됨(보호기간 이내)
 * - false: 저작권이 없다고 판단됨(보호기간 초과)
 * - null: 판단 불가능(필수 정보 부족/파싱 실패/분류 불명)
 *
 * 규칙:
 * - authorType === '개인':
 *   - deathYear를 4자리로 파싱 성공 시, (현재연도 - 몰년) <= 70 이면 true, > 70 이면 false
 *   - deathYear가 없거나 파싱 실패 시 null
 * - authorType === '단체':
 *   - publishYear 앞 4자리를 4자리 숫자로 파싱 성공 시, (현재연도 - 발행년도) <= 70 이면 true, > 70 이면 false
 *   - 파싱 실패 시 null
 * - 그 외 authorType: null
 *
 * @param authorType 저작자 유형('개인' | '단체' 등), null 허용
 * @param deathYear 몰년(4자리 문자열 예상), null 허용
 * @param publishYear 발행년도 원본 문자열(앞 4자리 사용), null 허용
 * @param now 기준 시각(테스트 목적으로 주입 가능), 기본값: 현재 시간
 * @returns boolean | null
 */
export function determineHasCopyright(
  authorType: string | null,
  deathYear: string | null,
  publishYear: string | null,
  now: Date = new Date(),
): boolean | null {
  const currentYear = now.getFullYear();
  const type = (authorType || "").trim();

  if (type === "개인") {
    const death = parseFourDigitYear(deathYear);
    if (death == null) {
      // 몰년을 알 수 없으면 판단 불가
      return null;
    }
    const elapsed = currentYear - death;
    return elapsed <= 70;
  }

  if (type === "단체") {
    const pub = extractPublishYear(publishYear);
    if (pub == null) {
      // 발행년도를 알 수 없으면 판단 불가
      return null;
    }
    const elapsed = currentYear - pub;
    return elapsed <= 70;
  }

  // 알 수 없는 authorType → 판단 불가
  return null;
}

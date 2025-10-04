import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    const d = value instanceof Date ? value : new Date(value);
    return formatDistanceToNow(d, { addSuffix: true });
  }
}

function formatDistanceToNow(date: Date, opts?: { addSuffix?: boolean }): string {
  const addSuffix = opts?.addSuffix ?? true;

  const now = new Date().getTime();
  const target = date.getTime();

  const diffMs = target - now;
  const future = diffMs > 0;
  const absMs = Math.abs(diffMs);

  const sec = Math.round(absMs / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);
  const month = Math.round(day / 30);
  const year = Math.round(day / 365);

  let count: number;
  let unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';

  if (sec < 45) {
    count = Math.max(sec, 0);
    unit = 'second';
  } else if (sec < 90) {
    count = 1;
    unit = 'minute';
  } else if (min < 45) {
    count = min;
    unit = 'minute';
  } else if (min < 90) {
    count = 1;
    unit = 'hour';
  } else if (hour < 22) {
    count = hour;
    unit = 'hour';
  } else if (hour < 36) {
    count = 1;
    unit = 'day';
  } else if (day < 26) {
    count = day;
    unit = 'day';
  } else if (day < 45) {
    count = 1;
    unit = 'month';
  } else if (day < 320) {
    count = month;
    unit = 'month';
  } else if (day < 548) {
    count = 1;
    unit = 'year';
  } else {
    count = year;
    unit = 'year';
  }

  const unitPl = polishUnit(unit, count);

  if (!addSuffix) {
    return `${count} ${unitPl}`;
  }

  return future ? `za ${count} ${unitPl}` : `${count} ${unitPl} temu`;
}

function polishUnit(
  unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year',
  n: number
): string {
  const forms: Record<typeof unit, [singular: string, few: string, many: string]> = {
    second: ['sekundę', 'sekundy', 'sekund'],
    minute: ['minutę', 'minuty', 'minut'],
    hour: ['godzinę', 'godziny', 'godzin'],
    day: ['dzień', 'dni', 'dni'],
    month: ['miesiąc', 'miesiące', 'miesięcy'],
    year: ['rok', 'lata', 'lat'],
  };

  if (n % 10 === 1 && n % 100 !== 11) {
    return forms[unit][0];
  }
  if ([2, 3, 4].includes(n % 10) && !(n % 100 >= 12 && n % 100 <= 14)) {
    return forms[unit][1];
  }
  return forms[unit][2];
}

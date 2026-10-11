---
title: "SVD vs 고유분해 · 영화 평점 예시"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 6
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : SVD는 고유분해의 일반화라고 했는데, 정확히 어디가 같고 어디가 다른가?

<strong>핵심 아이디어</strong> : 둘 다 “기저변환 → 축별 늘임 → 기저변환”이다. 차이는 대상(정사각 vs 모든 행렬), 기저변환 행렬의 성질(일반 가역행렬 $P$ vs 직교행렬 $U,V$), 대각 성분(실수가 아닐 수 있음 vs 항상 $\ge0$인 실수)이다.

</div>

> <strong>교재 4.5.3</strong> : 고유분해와 SVD는 둘 다 “기저변환 → 축별 늘임 → 기저변환”의 세 단계이다. 다른 점은 <strong>대상 행렬의 범위</strong>와 <strong>기저변환 행렬의 성질</strong>이다.

<details>

<summary><strong>비교표</strong></summary>

|  | 고유분해 $A=PDP^{-1}$ | SVD $A=U\Sigma V^\top$ |
| --- | --- | --- |
| 대상 | 정사각 $n\times n$ | 모든 $m\times n$ |
| 존재 조건 | 고유벡터 기저가 있을 때만 (non-defective) | 항상 존재 |
| 기저변환 행렬 | $P$는 직교가 아닐 수 있다. 단순 회전+늘임이 아니다. | $U,V$는 직교행렬이라 회전(반사)이다. |
| 두 행렬의 관계 | $P$와 $P^{-1}$은 서로 역이다. | $U$와 $V$는 일반적으로 서로 역이 아니다. (다른 공간) |
| 도메인과 코도메인 | 같은 공간 | 차원이 달라도 된다. |
| 대각 성분 | 실수가 아닐 수도 있다. | 항상 실수이고 $\ge0$이다. |

</details>

<details>

<summary><strong>둘의 연결 고리</strong></summary>

> • $A$의 <strong>왼쪽 특이벡터</strong> $u_i$는 $AA^\top$의 고유벡터이다.
• $A$의 <strong>오른쪽 특이벡터</strong> $v_i$는 $A^\top A$의 고유벡터이다.
• $A$의 0이 아닌 특이값은 $AA^\top$와 $A^\top A$의 0이 아닌 고유값의 제곱근이다.
• 대칭행렬에서 둘이 같아지는 경우는 SVD 노트의 “특수한 경우”에서 다뤘다. (SPD일 때 완전히 같고, 음의 고유값이 있으면 $\sigma_i=|\lambda_i|$)

</details>

<details>

<summary><strong>예시 : 교재 Example 4.14 (영화 평점)</strong></summary>

> 세 명(Ali, Beatrix, Chandra)이 네 영화(Star Wars, Blade Runner, Amelie, Delicatessen)에 매긴 평점이다. 행 = 영화, 열 = 사람이다.
$A=\begin{bmatrix}5&4&1\\5&5&0\\0&0&5\\1&0&4\end{bmatrix}$, $\Sigma$의 특이값은 $9.6438,\;6.3639,\;0.7056$ (계산으로 확인 ✓)

> <strong>해석 규칙</strong> : $u_i$는 “전형적인 영화”, $v_j$는 “전형적인 사람”으로 읽는다. 특정 영화는 $u_i$들의 선형결합, 특정 사람은 $v_j$들의 선형결합이다.
• $u_1$은 두 SF 영화(Star Wars, Blade Runner)에서 절댓값이 크고 $\sigma_1$도 가장 크다. $v_1$은 Ali와 Beatrix에서 크다 → <strong>SF 팬</strong>이라는 축이다.
• $u_2$는 프랑스 예술영화(Amelie, Delicatessen)를 담고 $v_2$는 Chandra가 이 축에 가깝다 → <strong>예술영화 팬</strong>이라는 축이다.

<div class="callout" role="note" data-kind="intuition">

이 해석이 성립하려면 교재가 든 가정이 필요하다. ① 모든 사람이 같은 선형 방식으로 평점을 준다. ② 평점에 오류나 잡음이 없다. ③ $u_i$를 전형적 영화, $v_j$를 전형적 사람으로 읽는다. 또 데이터에 다양한 사람과 영화가 충분히 들어 있어야 이 “공간”이 의미를 가진다.

</div>

</details>

<details>

<summary><strong>용어 : full SVD · reduced SVD · truncated SVD</strong></summary>

> • <strong>full SVD</strong> : 교재의 정의 (4.64). $U$는 $m\times m$, $V$는 $n\times n$, $\Sigma$는 $m\times n$이다.
• <strong>reduced SVD</strong> : $m\ge n$일 때 $U$를 $m\times n$, $\Sigma$를 $n\times n$ 대각행렬로 줄인 꼴이다. 수학 구조는 같고 행렬을 만드는 방식만 다르다.
• 계수 $r$에 맞춰 $U$를 $m\times r$, $\Sigma$를 $r\times r$, $V^\top$를 $r\times n$으로 줄이는 정의도 있다. 0이 아닌 값만 남는다.
• <strong>truncated SVD</strong> : 큰 특이값 몇 개만 남기는 것이다. 다음 노트(4.6)의 행렬 근사이다.

</details>

<details>

<summary><strong>추가정보</strong></summary>

- 교재는 SVD가 곡선 맞춤의 최소제곱, 연립방정식의 풀이 등 여러 ML 문제에서 쓰이고, 행렬을 SVD로 바꿔 계산하면 반올림 오차에 더 안정적일 때가 많다고 소개한다.
- 교재는 SVD가 행렬(2차원 배열)을 넘어 <strong>텐서</strong>로 일반화되는 분해 족의 특수한 경우라고 언급한다. (Tucker, CP 분해, Further Reading)

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- 행렬 근사 · Eckart-Young (4.6)
- PCA (10장)
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>“SVD = 고유분해”가 아니다.</strong> 같은 것은 SPD 행렬일 때뿐이다. 일반 정사각행렬이라도 둘은 다르다.
1. $u_i$<strong>는 영화, </strong>$v_j$<strong>는 사람이다.</strong> 행 = 영화, 열 = 사람이라서 $U$가 영화 쪽 기저이다. 행과 열의 의미가 바뀌면 $U,V$의 역할도 바뀐다.
1. <strong>singular value가 크다고 곧 “좋은 취향”이라는 뜻이 아니다.</strong> 그 방향으로 데이터가 얼마나 퍼져 있는지를 나타낼 뿐이다.

</div>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f409d87213b81c6bf80fc9e9e40fdb7)

[Untitled](https://app.notion.com/p/3f409d87213b81bd8955e4d3c3980ca3)

[Untitled](https://app.notion.com/p/3f409d87213b815d87b6eacd28e10a89)

</details>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : 두 분해의 관계, 그리고 영화 평점 예시에서 큰 특이값이 데이터의 구조를 담는다는 점.

<strong>남은 것 → 다음 노트</strong> : 작은 특이값에 해당하는 항을 버려도 되는가? 버린다면 그 결과가 “가장 좋은” 근사인가?

</div>

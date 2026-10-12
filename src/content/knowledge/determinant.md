---
title: "Determinant"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/determinant-trace
status: seed
order: 1
---

> 정사각행렬 $A\in\mathbb{R}^{n\times n}$를 <strong>실수 하나</strong>로 보내는 함수 $\det(A)$.
기하학적으로는 <strong>A가 공간의 부피를 몇 배로 바꾸는가</strong>(방향이 뒤집히면 음수)를 나타내는 수이다.
※ 표기는 $\det(A)$ 또는 $|A|$. 후자의 $|\cdot|$는 절댓값이 아니다.

<details>

<summary>

<strong>배경지식 (0에서 시작)</strong>

</summary>

<details>

<summary>

① 왜 정사각행렬에서만 정의되는가

</summary>

> $A\in\mathbb{R}^{m\times n}$은 $\mathbb{R}^n\to\mathbb{R}^m$으로 벡터를 보내는 함수이다.
입력 공간과 출력 공간의 차원이 다르면 "부피가 몇 배가 되었는가"를 비교할 수 없다. (3차원 상자가 2차원 평면으로 가면 부피끼리 비교할 대상이 없다.)
그래서 $m=n$인 정사각행렬에서만 $\det$이 정의된다.

</details>

<details>

<summary>

② 행렬의 열 = 표준기저가 이동한 곳

</summary>

> $Ae_i$는 A의 $i$번째 열 $a_i$이다. (3장 Rotation에서 본 관점과 같다.)
따라서 A는 표준기저 $e_1,\dots,e_n$이 만드는 단위정육면체를 $a_1,\dots,a_n$이 만드는 도형으로 옮기는 변환이다.

</details>

<details>

<summary>

③ 평행사변형 / 평행육면체 (parallelepiped)

</summary>

> 벡터 $v_1,\dots,v_n$을 "변"으로 삼아 만든 도형 $\{t_1v_1+\cdots+t_nv_n \mid 0\le t_i\le 1\}$.
2차원이면 평행사변형(넓이), 3차원이면 평행육면체(부피)이다.
표준기저가 만드는 도형은 한 변이 1인 정사각형/정육면체이므로 넓이·부피가 1이다.

</details>

<details>

<summary>

④ 역행렬이 있다는 것 (Rank / Kernel 복습)

</summary>

> A가 역행렬을 가진다 $\iff$ 변환 A를 되돌릴 수 있다 $\iff \text{rank}(A)=n \iff \ker(A)=\{0\}$.
서로 다른 입력이 같은 출력으로 뭉쳐지는 일이 없다는 뜻이다.

</details>

</details>

<details>

<summary>

<strong>왜 필요한가</strong>

</summary>

> <strong>질문 : "이 행렬은 역행렬을 가지는가?"</strong> 를 숫자 하나로 판정하고 싶다.

작은 경우부터 보자.

- $1\times1$ : $A=a$의 역은 $\dfrac{1}{a}$이므로 $a\neq0$일 때만 역이 존재한다.
- $2\times2$ : $A^{-1}=\dfrac{1}{a_{11}a_{22}-a_{12}a_{21}}\begin{bmatrix}a_{22}&-a_{12}\\-a_{21}&a_{11}\end{bmatrix}$이므로 <strong>분모 </strong>$a_{11}a_{22}-a_{12}a_{21}$<strong>가 0이 아닐 때만</strong> 역이 존재한다.

이 "분모에 해당하는 수"를 $n\times n$ 일반의 경우로 확장한 것이 $\det(A)$이다.

> <strong>Theorem 4.1</strong> $A$가 invertible $\iff \det(A)\neq0$

---

이 수에는 또 하나의 얼굴이 있다. <strong>부피 배율</strong>이다. (아래 직관)

</details>

<details>

<summary>

<strong>직관 : 부피(넓이)를 몇 배로 만드는가</strong>

</summary>

<details>

<summary>

도입 : 2×2

</summary>

> $A=[a_1\;a_2]$는 표준기저 $e_1,e_2$를 각각 $a_1,a_2$로 보낸다. (열 = 기저의 이동)
따라서 $e_1,e_2$가 만드는 <strong>단위정사각형(넓이 1)</strong> 은 $a_1,a_2$가 만드는 <strong>평행사변형</strong>으로 변한다.
이 평행사변형의 넓이가 $|\det(A)|$이다. 즉 $|\det(A)|$는 <strong>A가 넓이를 몇 배로 만드는가</strong>이다.

</details>

<details>

<summary>

열벡터가 선형종속이면?

</summary>

> $a_2=\lambda a_1$이면 두 벡터가 한 직선 위에 놓여 평행사변형이 <strong>납작하게 눌린다</strong> → 넓이 $0$ → $\det(A)=0$.
출력이 직선(1차원)에 갇혔으므로 rank가 줄었고, 서로 다른 입력들이 같은 출력으로 뭉쳐 사라지므로(kernel) 되돌릴 수 없다.

</details>

<div class="callout" role="note" data-kind="intuition">

<strong>하나의 사건을 여섯 가지 말로 한 것</strong>

$\det(A)=0$ $\iff$ 열벡터가 선형종속 $\iff \text{rank}(A)<n$ $\iff \ker(A)\neq\{0\}$ $\iff$ 역행렬이 없다 $\iff$ 부피가 0으로 납작해진다

</div>

<details>

<summary>

부호의 의미 : 방향(orientation)

</summary>

> 열의 순서를 바꾸면 $[a_1\;a_2]\to[a_2\;a_1]$ 평행사변형 모양은 같지만 $e_1\to e_2$의 회전 방향(반시계/시계)이 뒤집힌다. 그래서 부호가 바뀐다.
$\det(A)>0$ : 방향 유지 / $\det(A)<0$ : 거울처럼 뒤집힘.

</details>

<details>

<summary>

3차원

</summary>

> 세 열벡터 $r,g,b$가 만드는 <strong>평행육면체의 부피 </strong>$=|\det([r\;g\;b])|$. 차원이 올라가도 같은 구조이다.

</details>

</details>

<details>

<summary>

<strong>예시</strong>

</summary>

<details>

<summary>

① 대각 형태

</summary>

> $A=\begin{bmatrix}b&0\\0&g\end{bmatrix}$ : 표준기저를 각각 $b$배, $g$배로 늘인다. 단위정사각형 → $b\times g$ 직사각형이므로 넓이 $bg$.
$\det(A)=b\cdot g-0\cdot0=bg$.

</details>

<details>

<summary>

② 납작해지는 경우 (Kernel 노트의 그 행렬)

</summary>

> $A=\begin{bmatrix}1&1\\2&2\end{bmatrix}$ : $\det(A)=1\cdot2-1\cdot2=0$.
두 열이 똑같이 $(1,2)^\top$이라 $\text{rank}(A)=1$이고, $\ker(A)=\text{span}\{(1,-1)^\top\}$이 존재한다. 앞서 Kernel에서 본 예시와 같은 행렬이다.

</details>

<details>

<summary>

③ 3차원 : 부피 계산

</summary>

> $A=\begin{bmatrix}2&6&1\\0&1&4\\-8&0&-1\end{bmatrix}$ (열이 $r,g,b$)의 행렬식은 $\det(A)=-186$이다. (계산은 다음 노트의 Sarrus 참고)
평행육면체의 부피는 $|\det(A)|=186$이고, 음수이므로 이 세 벡터의 순서는 표준기저와 <strong>방향이 반대</strong>이다.

</details>

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- Invertibility 판정
- 고유값 (특성다항식)
- 닮음 · 기저변환에서 변하지 않는 양
- 변수변환 (6장)
- 다변량 Gaussian (6장)
- 이해 어려움

</details>

<details>

<summary>

<strong>추가정보</strong>

</summary>

- <strong>손으로 det를 계산하는 일 자체는 중요하지 않다.</strong> 교재 Further Reading에 따르면 아주 작은 경우를 제외하면 가우스 소거 같은 수치적 계산이 det보다 효율적이다. det는 계산 도구보다 <strong>이론 도구</strong>(invertibility 판정, 부피 배율, 고유값으로 이어지는 다리)로서 중요하다.
- Further Reading의 언급 : 아주 작은 경우를 제외하면 수치적 가우스 소거가 det보다 효율적이지만, det는 예컨대 <strong>기저의 방향을 부호로 알려주는</strong> 등 이론적 개념으로 남는다.
- ※ 교재 밖 보충 : det는 "각 열에 대해 선형(다중선형) + 두 열을 맞바꾸면 부호가 바뀜 + $\det(I)=1$"을 만족하는 유일한 함수이다. 이것이 det의 엄밀한 정의 방식 중 하나이다.

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>"정의가 뭐냐"가 안 보인다.</strong> 교재는 $n\ge4$인 일반 공식을 처음에 주지 않는다. $1\times1$, $2\times2$, $3\times3$ 공식 → 부피 해석 → 성질 → Laplace 재귀 순서로 <strong>간접적으로</strong> 정의한다. 한 번에 정의를 잡으려 하지 말고 "부피 배율"을 몸통으로 잡고 나머지를 거기에 붙이자.
1. $|A|$ 표기를 절댓값으로 읽는 혼동. (음수가 될 수 있다.)
1. "음수 부피"가 이상하게 느껴진다. → $\det$은 부피가 아니라 <strong>부호 있는(signed) 부피</strong>이고, 실제 부피는 $|\det(A)|$이다.
1. $m\neq n$인 행렬의 det를 묻는 실수. 정의되지 않는다.

</div>

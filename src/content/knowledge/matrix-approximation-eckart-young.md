---
title: "행렬 근사 · Eckart-Young"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 7
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : 큰 행렬을 정보 손실을 최소로 하면서 작게 만들 수 있는가?

<strong>핵심 아이디어</strong> : SVD를 $A=\sum_i\sigma_iu_iv_i^\top$, 즉 크기 순으로 정렬된 rank-1 조각의 합으로 읽는다. 앞의 $k$개만 남기면 rank-$k$ 근사이고, Eckart–Young는 이것이 스펙트럴 노름 기준 <strong>최선</strong>이며 오차가 첫 번째로 버린 특이값 $\sigma_{k+1}$이라고 보장한다.

</div>

> <strong>교재 4.6</strong> : SVD는 행렬을 <strong>rank-1 행렬들의 합</strong>으로 쓴다. $A=\sum_{i=1}^{r}\sigma_iu_iv_i^\top$ (4.91)
앞의 $k$개 항만 더하면 <strong>rank-</strong>$k$<strong> 근사</strong> $\widehat A(k)=\sum_{i=1}^{k}\sigma_iu_iv_i^\top$ (4.92)이다.
<strong>Theorem 4.25 (Eckart-Young)</strong> : 스펙트럴 노름 기준으로 rank-$k$ 행렬 중 $\widehat A(k)$가 $A$에 <strong>가장 가깝고</strong>, 오차는 $\Vert A-\widehat A(k)\Vert_2=\sigma_{k+1}$이다.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 외적과 rank-1 행렬</summary>

> $u\in\mathbb R^m$, $v\in\mathbb R^n$이면 $uv^\top\in\mathbb R^{m\times n}$이고 $(uv^\top)_{ij}=u_iv_j$이다. 모든 열이 $u$의 상수배이므로 <strong>rank 1</strong>이다.

</details>

<details>

<summary>② 행렬의 노름</summary>

> 3장에서 벡터의 길이를 노름으로 재듯, 행렬에도 노름을 정의해 “두 행렬이 얼마나 다른가”(오차)를 재수 있다. 교재는 그중 스펙트럴 노름을 쓴다.

</details>

<details>

<summary>③ rank</summary>

> rank는 독립인 열의 개수이다. rank-$k$ 행렬은 정보를 $k$개 방향으로만 담는다. (2장)

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> <strong>큰 행렬을 “충분히 비슷한 작은 행렬”로 바꾸고 싶다.</strong>

<strong>원인 → 결과 사슬</strong>

1. <strong>저장·계산량이 줄어든다</strong> : $m\times n$ 행렬은 $mn$개의 수가 필요하지만 rank-$k$ 근사는 $k(m+n+1)$개면 된다. (교재 예시 : $1432\times1910$ 이미지는 $2{,}735{,}120$개, rank-5 근사는 $5\cdot(1432+1910+1)=16{,}715$개로 원본의 약 $0.6\%$이다.)
2. <strong>중요한 정보만 남는다</strong> : $\sigma_i$가 큰 항이 구조를 담고 작은 항은 잡음에 가깝다. 노이즈 제거, 압축에 쓰인다.
3. <strong>“최선”이 보장된다</strong> : Eckart-Young 덕분에 SVD의 truncation이 같은 rank 중 가장 오차가 작다.
4. <strong>차원 축소 · PCA (10장)</strong> 로 이어진다.

</details>

<details>

<summary><strong>유도 : 왜 합으로 쓸 수 있는가 (교재 (4.91))</strong></summary>

> $\Sigma$가 대각이므로 $U\Sigma V^\top$을 열과 행의 곱으로 펼치면 $u_i$와 $v_j$가 짝이 맞는 항($i=j$)만 남는다.
$i\neq j$이면 $\Sigma_{ij}=0$이라 사라지고, $i>r$이면 $\sigma_i=0$이라 사라진다. 따라서 $A=\sum_{i=1}^{r}\sigma_iu_iv_i^\top=\sum_{i=1}^{r}\sigma_iA_i$, $A_i:=u_iv_i^\top$ (rank-1)

</details>

<details>

<summary><strong>스펙트럴 노름 (Definition 4.23, Theorem 4.24)</strong></summary>

> $\Vert A\Vert_2:=\max_{x\neq0}\dfrac{\Vert Ax\Vert_2}{\Vert x\Vert_2}$ : $A$가 벡터를 <strong>최대 몇 배까지 늘리는가</strong>이다.
<strong>Theorem 4.24</strong> : $\Vert A\Vert_2=\sigma_1$ (가장 큰 특이값). 교재는 증명을 연습문제 4.12로 남겨 둔다.
따라서 $A-\widehat A(k)=\sum_{i=k+1}^{r}\sigma_iu_iv_i^\top$ (교재 (4.96))의 가장 큰 특이값이 $\sigma_{k+1}$이므로 $\Vert A-\widehat A(k)\Vert_2=\sigma_{k+1}$ (교재 (4.95))이다.

</details>

<details>

<summary><strong>Eckart-Young의 증명 아이디어 (교재 4.6)</strong></summary>

> $\text{rank}(B)\le k$인 $B$가 $\Vert A-B\Vert_2<\sigma_{k+1}$을 만족한다고 가정하고 모순을 찾는다.
① $B$의 kernel $Z$는 차원이 적어도 $n-k$이고, $x\in Z$이면 $Bx=0$이므로 $\Vert Ax\Vert=\Vert(A-B)x\Vert\le\Vert A-B\Vert_2\Vert x\Vert<\sigma_{k+1}\Vert x\Vert$.
② 한편 $v_1,\dots,v_{k+1}$이 span하는 $(k+1)$차원 부분공간에서는 $\Vert Ax\Vert\ge\sigma_{k+1}\Vert x\Vert$이다.
③ 두 부분공간의 차원의 합이 $n$보다 크므로 둘에 동시에 속하는 0이 아닌 벡터가 있다. ①과 ②가 충돌한다. (Rank-Nullity와의 모순)

</details>

<details>

<summary><strong>예시 : 교재 Example 4.15 (영화 평점 이어서)</strong></summary>

> 4.5의 평점 행렬 $A$에서 rank-1 항 두 개를 보자.
$A_1=u_1v_1^\top\approx\begin{bmatrix}0.49&0.44&0.12\\0.53&0.47&0.13\\0.07&0.06&0.02\\0.11&0.10&0.03\end{bmatrix}$ : Ali와 Beatrix가 SF 영화를 좋아한다는 것은 담지만 Chandra의 평점은 못 담는다.
$A_2=u_2v_2^\top$ : Chandra와 예술영화를 담는다.
$\widehat A(2)=\sigma_1A_1+\sigma_2A_2\approx\begin{bmatrix}4.78&4.24&1.02\\5.23&4.75&-0.03\\0.25&-0.27&4.97\\0.75&0.28&4.03\end{bmatrix}$는 원래의 $A$와 매우 비슷하다.
오차 검산 : $\Vert A-\widehat A(2)\Vert_2=\sigma_3=0.7056$ ✓ (계산으로 확인), rank-1 근사의 오차는 $\sigma_2=6.3639$ ✓.
해석 : 세 번째 취향 축의 증거가 데이터에 거의 없다. 영화 취향 공간은 SF와 예술영화의 <strong>2차원</strong>이다.

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- PCA (10장)
- 이미지 압축 · 노이즈 제거
- 정규화 (ill-posed problem)
- 이해 어려움

</details>

<details>

<summary><strong>추가정보</strong></summary>

- 교재는 이 근사를 “손실 압축의 한 형태”로 해석한다. 이미지 처리, 노이즈 필터링, ill-posed 문제의 정규화, 차원 축소와 PCA에 쓰인다.
- 교재 Further Reading : 저차원 근사는 계산 효율을 위해 자주 쓰이고, 결측값이 있는 행렬 처리에도 쓰인다.
- ※ 교재 밖 보충 : Eckart-Young는 Frobenius 노름에서도 성립한다. 이때 오차는 $\sqrt{\sigma_{k+1}^2+\cdots+\sigma_r^2}$이다.

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. <strong>오차는 </strong>$\sigma_k$<strong>가 아니라 </strong>$\sigma_{k+1}$<strong>이다.</strong> 버려진 항 중 가장 큰 것이다.
1. <strong>“가장 좋다”의 범위.</strong> rank가 $k$인 행렬들 중에서, 스펙트럴 노름 기준으로 가장 가깝다는 뜻이다.
1. <strong>특이값이 크기순으로 정렬되어 있어야 한다.</strong> 앞의 $k$개가 가장 큰 $k$개가 되도록 $\sigma_1\ge\sigma_2\ge\cdots$로 놓는다.
1. $\widehat A(k)$<strong>의 rank는 </strong>$k$<strong>이다.</strong> (원래 rank가 $r\ge k$이고 $\sigma_k>0$일 때) $A_i$ 하나가 rank 1이다.
1. <strong>저장량은 </strong>$k(m+n+1)$<strong>이다.</strong> 특이값 $k$개와 $m$차원, $n$차원 벡터 $k$쌍이다.

</div>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f409d87213b81ea9f3ec0f8bca00a05)

[Untitled](https://app.notion.com/p/3f409d87213b81a681bef9e2b4f8ad61)

</details>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : SVD로 임의의 행렬을 rank-$k$로 최선 압축할 수 있다.

<strong>남은 것 → 다음 노트</strong> : 4장에서 행렬의 종류(대칭, 직교, PD 등)와 분해(고유분해, Cholesky, SVD 등)가 많이 나왔다. 내 행렬에는 무엇을 쓸 수 있는가?

</div>

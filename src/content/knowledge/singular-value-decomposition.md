---
title: "Singular Value Decomposition (SVD)"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 4
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : 위의 두 한계(정사각 한정, 대각화 불가능한 경우)를 모두 없앨 수는 없는가?

<strong>핵심 아이디어</strong> : 고유분해는 입력 기저와 출력 기저를 같게($S=T$) 고정해서 한계가 생겼다. 도메인 기저 $V$와 코도메인 기저 $U$를 <strong>따로</strong> 고르고 둘 다 정규직교로 잡으면 $A=U\Sigma V^\top$이 항상 존재한다. 재료는 Spectral Theorem이다. $A^\top A$는 항상 대칭 PSD라 정규직교 고유기저가 보장되고, 그것이 $V$가 된다.

</div>

> <strong>Theorem 4.22 (SVD)</strong> 모든 $A\in\mathbb R^{m\times n}$ (rank $r$)은 $A=U\Sigma V^\top$으로 분해된다.
$U\in\mathbb R^{m\times m}$, $V\in\mathbb R^{n\times n}$은 <strong>직교행렬</strong>이고, $\Sigma\in\mathbb R^{m\times n}$은 $\Sigma_{ii}=\sigma_i\ge0$, 나머지 성분은 $0$이다. <strong>정사각이 아니어도, defective여도 항상 존재한다.</strong>
$\sigma_i$ : singular value (관례상 $\sigma_1\ge\sigma_2\ge\cdots\ge0$), $u_i$ : left-singular vector, $v_j$ : right-singular vector

<details>

<summary>

<strong>배경지식 (0에서 시작)</strong>

</summary>

<details>

<summary>

① 직교행렬 (3장 복습)

</summary>

> 열이 정규직교인 정사각행렬 $Q$는 $Q^\top Q=I$, 즉 $Q^{-1}=Q^\top$이다. 길이와 사이각을 보존하므로 <strong>회전 또는 반사</strong>이다.

</details>

<details>

<summary>

② $A^\top A$는 항상 대칭 PSD (4.2)

</summary>

> $A$가 직사각이어도 $A^\top A\in\mathbb R^{n\times n}$, $AA^\top\in\mathbb R^{m\times m}$은 정사각 대칭행렬이다. (Theorem 4.14) Spectral Theorem(Theorem 4.15)에 의해 정규직교 고유기저가 있고, 고유값은 $\ge0$이다. <strong>SVD는 이 사실 위에 서 있다.</strong>

</details>

<details>

<summary>

③ 기저변환은 도메인과 코도메인에서 따로 일어난다 (2장)

</summary>

> $\tilde A_\Phi=T^{-1}A_\Phi S$에서 $S$는 도메인 $\mathbb R^n$의 기저변환, $T$는 코도메인 $\mathbb R^m$의 기저변환이다.
고유분해는 $S=T$인 경우였다. SVD는 $S$<strong>와 </strong>$T$<strong>를 따로 고른다.</strong>

</details>

<details>

<summary>

④ rank와 kernel (2장)

</summary>

> $\text{rank}(A)=r$이면 $\dim\ker(A)=n-r$이다. (Rank-Nullity) 0이 아닌 singular value의 개수가 곧 $r$이다. ※ 교재 밖 보충 : $A^\top Ax=0\Rightarrow x^\top A^\top Ax=\Vert Ax\Vert^2=0\Rightarrow Ax=0$이므로 $\ker(A^\top A)=\ker(A)$이고, $\text{rank}(A^\top A)=\text{rank}(A)=r$이다. 즉 $A^\top A$의 0이 아닌 고유값이 정확히 $r$개이다.

</details>

</details>

<details>

<summary>

<strong>왜 필요한가</strong>

</summary>

> <strong>고유분해의 한계(정사각·non-defective)는 4.4 끝에서 정리했다.</strong> 교재는 SVD가 “fundamental theorem of linear algebra”라고 불려 왔다고 소개한다. 모든 행렬에 적용되고 항상 존재하기 때문이다.

<strong>원인 → 결과 사슬</strong>

1. <strong>모든 행렬에 존재한다</strong> : 직사각 데이터 행렬에 바로 적용할 수 있다.
2. $U,V$<strong>가 직교행렬이다</strong> : 둘 다 길이를 바꾸지 않는 회전·반사이다. 늘이고 줄이는 일은 $\Sigma$만 한다. 그래서 변환의 “크기”가 $\sigma_i$에 분리되어 드러난다.
3. $\sigma_i$<strong>를 크기순으로 정렬한다</strong> : 중요한 방향부터 읽을 수 있다. 이것이 행렬 근사 (4.6)와 PCA (10장)의 바탕이다.
4. <strong>kernel의 정규직교 기저도 같이 준다</strong> : $i>r$인 $v_i$는 $Av_i=0$이므로 $\ker(A)$의 정규직교 기저이다. (교재 4.5.2)

</details>

<details>

<summary>

<strong>기하학적 직관 (교재 4.5.1, Figure 4.8)</strong>

</summary>

> $A=U\Sigma V^\top$을 <strong>오른쪽부터</strong> 읽으면 세 단계이다. 고유분해(4.4)와 같은 구조이다.
① $V^\top$ : 도메인 $\mathbb R^n$에서 표준기저를 $v_i$<strong> 기저로 기저변환</strong>한다. ($V^\top=V^{-1}$)
② $\Sigma$ : 새 좌표의 각 축을 $\sigma_i$<strong>배</strong> 하고, 동시에 $\mathbb R^n$에서 $\mathbb R^m$으로 <strong>차원을 맞춘다.</strong> ($m>n$이면 0을 덧붙이고 $m<n$이면 일부를 버린다.)
③ $U$ : 코도메인 $\mathbb R^m$에서 $u_i$<strong> 기저를 표준기저로</strong> 돌려놓는다.

<div class="callout" role="note" data-kind="intuition">

<strong>고유분해와 가장 다른 점.</strong> SVD는 도메인과 코도메인이 서로 다른 공간이라 <strong>기저를 따로 고르고</strong>, 두 기저를 이어 주는 것이 $\Sigma$이다. 즉 $Av_i=\sigma_iu_i$이다. (항목별 비교는 “SVD vs 고유분해” 노트의 표)

</div>

</details>

<details>

<summary>

<strong>예시 : 교재 Example 4.12 (격자 점의 변환)</strong>

</summary>

> $A=\begin{bmatrix}1&-0.8\\0&1\\1&0\end{bmatrix}\in\mathbb R^{3\times2}$
2차원 격자 점들을 $V^\top$으로 돌리고, $\Sigma$로 늘려서 3차원의 $x_1x_2$ 평면에 올린 뒤, $U$로 3차원 안에서 돌려놓는다. 결과는 3차원 안의 <strong>타원 모양 평면 조각</strong>이다. (Figure 4.9)
검산 : $A^\top A=\begin{bmatrix}2&-0.8\\-0.8&1.64\end{bmatrix}$의 고유값은 $2.64,\;1$이므로 $\sigma_1=\sqrt{2.64}\approx1.62$, $\sigma_2=1$이다. 교재 $\Sigma$의 대각 성분 $1.62,\;1.0$과 일치한다. ✓

</details>

<details>

<summary>

<strong>특수한 경우 : SPD 행렬의 SVD = 고유분해</strong>

</summary>

> $S=S^\top=PDP^\top$이고 SVD가 $S=U\Sigma V^\top$일 때 $U=P=V$, $\Sigma=D$로 두면 둘이 같아진다. (교재 4.5.2 Remark)
※ 교재 밖 보충 : 일반 대칭행렬에서 음의 고유값이 있으면 $\sigma_i=|\lambda_i|$가 되어 SVD와 고유분해가 달라진다.

</details>

<details>

<summary>

<strong>이걸 모르면?</strong>

</summary>

- 행렬 근사 · Eckart-Young (4.6)
- PCA (10장)
- 최소제곱 · 연립방정식에서의 SVD 활용 (교재 4.5 끝에서 언급)
- 이해 어려움

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $\Sigma$<strong>는 </strong>$A$<strong>와 같은 크기(</strong>$m\times n$<strong>)이다.</strong> 정사각 대각행렬이 아니다. 대각 성분 아래(또는 오른쪽)는 0으로 채운다.
1. $U$<strong>와 </strong>$V$<strong>는 서로 역행렬이 아니다.</strong> 고유분해의 $P$와 $P^{-1}$과 다르다. $U^{-1}=U^\top$, $V^{-1}=V^\top$ 각각이 자기 자신의 역이다.
1. $\sigma_i$<strong>는 </strong>$A$<strong>의 고유값이 아니다.</strong> $A^\top A$ 고유값의 제곱근이다. (다음 노트)
1. $\Sigma$<strong>는 유일하지만 </strong>$U,V$<strong>는 유일하지 않다.</strong> 열의 부호를 같이 바꿔도 되고, $\sigma_i$가 겹치면 기저를 고르는 방법도 여러 가지이다.

</div>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : 모든 행렬에 $A=U\Sigma V^\top$이 존재하고, 직교행렬 $U,V$는 회전(반사), $\Sigma$는 축별 늘임이다.

<strong>남은 것 → 다음 노트</strong> : 존재한다는 것은 알았다. 구체적인 $A$에서 $U,\Sigma,V$를 어떻게 실제로 만들어 내는가?

</div>

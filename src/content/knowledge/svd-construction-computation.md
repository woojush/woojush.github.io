---
title: "SVD의 구성 · 계산"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/matrix-decompositions
status: seed
order: 5
---

<div class="callout" role="note" data-kind="note">

<strong>이어받는 질문</strong> : $U,\Sigma,V$를 어디서 구하는가?

<strong>핵심 아이디어</strong> : $V$는 $A^\top A$의 고유벡터, $\sigma_i=\sqrt{\lambda_i}$, $u_i=Av_i/\sigma_i$이다. 즉 SVD는 <strong>고유분해 한 번 + 상(image) 정규화</strong>로 만들어진다.

</div>

> <strong>구성 전략 (교재 4.5.2)</strong> : SVD를 찾는다는 것은 도메인 $\mathbb R^n$의 정규직교기저 $V=(v_1,\dots,v_n)$과 코도메인 $\mathbb R^m$의 정규직교기저 $U=(u_1,\dots,u_m)$을 찾는 것이다.
$v_i$<strong>를 먼저 만들고, </strong>$u_i$<strong>는 </strong>$v_i$<strong>의 정규화된 상(image)으로 만든다.</strong>

<details>

<summary><strong>유도 : 왜 이렇게 만들면 되는가</strong></summary>

<details>

<summary>Step 1. $V$와 $\sigma_i$는 $A^\top A$의 고유분해에서 나온다</summary>

> $A=U\Sigma V^\top$이 있다고 가정하고 $A^\top A$에 대입한다.
$A^\top A=(U\Sigma V^\top)^\top(U\Sigma V^\top)=V\Sigma^\top U^\top U\Sigma V^\top=V(\Sigma^\top\Sigma)V^\top$ ($U^\top U=I$)
$\Sigma^\top\Sigma=\text{diag}(\sigma_1^2,\dots,\sigma_n^2)$이므로 이것은 $A^\top A$의 고유분해이다. 따라서
$v_i$<strong> = </strong>$A^\top A$<strong>의 정규직교 고유벡터, </strong>$\sigma_i^2=\lambda_i$ (교재 (4.74), (4.75))
※ 교재 밖 보충 : $A^\top A$가 PSD(Theorem 4.14)라 $\lambda_i\ge0$이므로 $\sigma_i=\sqrt{\lambda_i}$가 실수로 정의되고, 대칭이라(Spectral Theorem) 정규직교 $V$가 항상 존재한다. SVD가 모든 행렬에 존재하는 이유가 이 두 줄이다.

</details>

<details>

<summary>Step 2. $Av_i$들은 서로 직교하고 길이가 $\sigma_i$이다</summary>

> $i\neq j$이면 $(Av_i)^\top(Av_j)=v_i^\top(A^\top A)v_j=\lambda_jv_i^\top v_j=0$이다. (교재 (4.77))
길이 : $\Vert Av_i\Vert^2=v_i^\top A^\top Av_i=\lambda_i\,v_i^\top v_i=\lambda_i=\sigma_i^2$이므로 $\Vert Av_i\Vert=\sigma_i$이다.

</details>

<details>

<summary>Step 3. $u_i$는 $Av_i$를 정규화해서 얻는다</summary>

> $u_i:=\dfrac{Av_i}{\Vert Av_i\Vert}=\dfrac1{\sigma_i}Av_i$ ($\sigma_i>0$인 $i\le r$). Step 2에 의해 $u_i$들은 정규직교이다. (교재 (4.78))
정리하면 <strong>singular value equation</strong> $Av_i=\sigma_iu_i$이다. (교재 (4.79)) 열로 모으면 $AV=U\Sigma$이고, 오른쪽에 $V^\top$를 곱하면 $A=U\Sigma V^\top$이다.

</details>

<div class="callout" role="note" data-kind="intuition">

<strong>핵심 : </strong>$v_i$<strong>를 먼저 정하고 </strong>$u_i=Av_i/\sigma_i$<strong>로 만든다.</strong> $Av_i=\sigma_iu_i$는 고유값 방정식 $Ax=\lambda x$와 닮았지만 좌우의 벡터가 다르다. 교재도 같은 점을 짚는다.
※ 교재 밖 보충 : $AA^\top$의 고유벡터를 따로 구하면 부호가 어긋나 $Av_i=\sigma_iu_i$가 깨질 수 있다. 그래서 짝을 이 식으로 정한다.

</div>

<details>

<summary>$i>r$인 경우 (kernel과 남는 $u_i$)</summary>

> $\sigma_i=0$인 $v_i$는 $Av_i=0$이므로 $\ker(A)$<strong>의 정규직교 기저</strong>가 된다. 이 경우 $u_i=Av_i/\sigma_i$는 0으로 나눠서 쓸 수 없다. $u_{r+1},\dots,u_m$은 정규직교이기만 하면 된다. (교재 4.5.2)
※ 교재 밖 보충 : 실제로는 span($u_1,\dots,u_r$)의 직교여공간에서 정규직교기저를 고르면 된다. (3장 Gram-Schmidt)

</details>

</details>

<details>

<summary><strong>계산 순서</strong></summary>

> 1. $A^\top A$의 고유값 $\lambda_i$와 정규직교 고유벡터 $v_i$를 구한다. ($V$)
2. $\sigma_i=\sqrt{\lambda_i}$로 $\Sigma$를 만든다. $A$와 같은 크기이다.
3. $u_i=\dfrac1{\sigma_i}Av_i$로 $U$를 만든다. 모자라는 열은 정규직교하게 채운다.

<div class="callout" role="note" data-kind="stuck">

교재는 컴퓨터에서 이 방식($A^\top A$의 고유분해)은 수치적 성질이 나쁘서, 실제 SVD는 다른 방법으로 계산한다고 밝힌다. 이 순서는 <strong>손으로 원리를 익히기 위한 계산법</strong>이다.

</div>

</details>

<details>

<summary><strong>예시 : 교재 Example 4.13</strong></summary>

> $A=\begin{bmatrix}1&0&1\\-2&1&0\end{bmatrix}$ ($2\times3$, rank 2)

<details>

<summary>Step 1. 오른쪽 특이벡터 $V$</summary>

> $A^\top A=\begin{bmatrix}5&-2&1\\-2&1&0\\1&0&1\end{bmatrix}$의 고유값은 $6,\;1,\;0$이고 정규직교 고유벡터는
$v_1=\dfrac1{\sqrt{30}}\begin{bmatrix}5\\-2\\1\end{bmatrix},\;v_2=\dfrac1{\sqrt5}\begin{bmatrix}0\\1\\2\end{bmatrix},\;v_3=\dfrac1{\sqrt6}\begin{bmatrix}-1\\-2\\1\end{bmatrix}$이다.

</details>

<details>

<summary>Step 2. 특이값 행렬 $\Sigma$</summary>

> $\sigma_1=\sqrt6$, $\sigma_2=1$ (rank 2이므로 0이 아닌 특이값은 2개)
$\Sigma$는 $A$와 같은 $2\times3$ 크기이므로 $\Sigma=\begin{bmatrix}\sqrt6&0&0\\0&1&0\end{bmatrix}$이다.

</details>

<details>

<summary>Step 3. 왼쪽 특이벡터 $U$</summary>

> $u_1=\dfrac1{\sqrt6}Av_1=\dfrac1{\sqrt5}\begin{bmatrix}1\\-2\end{bmatrix},\;u_2=\dfrac11Av_2=\dfrac1{\sqrt5}\begin{bmatrix}2\\1\end{bmatrix}$
$U=\dfrac1{\sqrt5}\begin{bmatrix}1&2\\-2&1\end{bmatrix}$ ($m=2$이므로 두 열로 충분하다.)

</details>

<details>

<summary>검산</summary>

> • $Av_3=\begin{bmatrix}-1+0+1\\2-2+0\end{bmatrix}=\begin{bmatrix}0\\0\end{bmatrix}$ : $v_3$는 $\ker(A)$의 기저이다. ($\sigma_3=0$)
• $\sigma_1u_1v_1^\top+\sigma_2u_2v_2^\top=\tfrac15\begin{bmatrix}5&-2&1\\-10&4&-2\end{bmatrix}+\tfrac15\begin{bmatrix}0&2&4\\0&1&2\end{bmatrix}=\begin{bmatrix}1&0&1\\-2&1&0\end{bmatrix}=A$ ✓

</details>

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점</strong>

1. $u_i$<strong>를 </strong>$AA^\top$<strong>에서 따로 구하지 않는다.</strong> $u_i=Av_i/\sigma_i$로 짝을 맞춘다.
1. $\sigma_i=0$<strong>인 </strong>$v_i$<strong>에서는 </strong>$u_i$<strong>를 이 식으로 못 구한다.</strong> 0으로 나누게 된다.
1. $A^\top A$<strong>는 </strong>$n\times n$<strong>, </strong>$AA^\top$<strong>는 </strong>$m\times m$<strong>이다.</strong> 크기가 다르지만 0이 아닌 고유값은 같다. (교재 Exercise 4.11)
1. $\sigma_i=\sqrt{\lambda_i}$<strong>이다.</strong> 고유값을 그대로 $\Sigma$에 넣으면 틀린다.

</div>

<div class="callout" role="note" data-kind="note">

<strong>풀린 것</strong> : $V$와 $\sigma_i$는 $A^\top A$의 고유분해에서, $U$는 $Av_i$의 정규화에서 나온다.

<strong>남은 것 → 다음 노트</strong> : 이 구성이 고유분해와 정확히 무엇이 같고 무엇이 다른가? 실제 데이터에서는 무엇이 보이는가?

</div>

---
title: "고유값 · 고유벡터 계산"
date: 2026-10-11
topic: ai/mathematics/linear-algebra/eigen-theory
status: seed
order: 2
---

> 고유값은 <strong>특성다항식 </strong>$p_A(\lambda)=0$<strong>의 근</strong>, 고유벡터(eigenspace)는 각 근마다 $(A-\lambda I)x=0$<strong>의 해</strong>이다.

<details>

<summary><strong>배경지식 (0에서 시작)</strong></summary>

<details>

<summary>① 동차 연립방정식과 Kernel</summary>

> $Mx=0$을 동차(homogeneous) 방정식이라 하고, 그 해 집합이 $\ker(M)$이다. 가우스 소거로 free variable을 잡아 해를 $t\cdot(\text{방향벡터})$ 꼴로 쓴다. (Kernel, Rank-Nullity 노트)

</details>

</details>

<details>

<summary><strong>왜 필요한가</strong></summary>

> 정의 $Ax=\lambda x$만으로는 $\lambda$와 $x$를 동시에 찾아야 해서 막막하다. 앞 노트에서 만든 특성다항식이 이 문제를 <strong>두 단계로 쪼개다.</strong>
① $\lambda$만의 방정식을 푸다. ② 구한 $\lambda$마다 $x$를 푸다.

</details>

<details>

<summary><strong>표준 절차 (3 Step)</strong></summary>

<div class="callout" role="note" data-kind="intuition">



1. <strong>특성다항식</strong> $p_A(\lambda)=\det(A-\lambda I)$를 쓴다.
2. $p_A(\lambda)=0$을 풀어 <strong>고유값</strong>을 구한다.
3. 각 고유값 $\lambda$마다 $(A-\lambda I)x=0$을 풀어 <strong>eigenspace</strong>를 구한다.

</div>

</details>

<details>

<summary><strong>예시 : 교재 Example 4.5</strong></summary>

> $A=\begin{bmatrix}4&2\\1&3\end{bmatrix}$

<details>

<summary>Step 1–2. 고유값</summary>

> $p_A(\lambda)=(4-\lambda)(3-\lambda)-2\cdot1=\lambda^2-7\lambda+10=(\lambda-2)(\lambda-5)$
따라서 $\lambda_1=2,\;\lambda_2=5$.

</details>

<details>

<summary>Step 3. $\lambda=5$의 eigenspace</summary>

> $A-5I=\begin{bmatrix}-1&2\\1&-2\end{bmatrix}$, $(A-5I)x=0\Rightarrow x_1=2x_2$.
$E_5=\text{span}\Big\{\begin{bmatrix}2\\1\end{bmatrix}\Big\}$

</details>

<details>

<summary>Step 3. $\lambda=2$의 eigenspace</summary>

> $A-2I=\begin{bmatrix}2&2\\1&1\end{bmatrix}$, $(A-2I)x=0\Rightarrow x_2=-x_1$.
$E_2=\text{span}\Big\{\begin{bmatrix}1\\-1\end{bmatrix}\Big\}$

</details>

<details>

<summary>검산 (반드시 하는 습관)</summary>

> • $A(2,1)^\top=(8+2,\,2+3)=(10,5)=5(2,1)^\top$ ✓
• $A(1,-1)^\top=(4-2,\,1-3)=(2,-2)=2(1,-1)^\top$ ✓
• 합 $2+5=7=\text{tr}(A)$, 곱 $2\cdot5=10=\det(A)$ ✓ (Theorem 4.16·4.17의 예고)

</details>

</details>

<details>

<summary><strong>중복도 : Algebraic vs Geometric Multiplicity</strong></summary>

고유값·고유벡터를 통해 대각화가 가능하다. 대각화는 선형변환을 더 단순하게 표현할 수 있게 한다.

n by n행렬 A를 대각화하려면 <strong>선형독립인 고유벡터가 n개 존재</strong>해야한다. 
그 이유는 대각화 $P^{-1}AP=D$가 "$\mathbb{R}^n$의 기저를 표준기저에서 고유벡터들로 갈아끼우는 일"이기 때문이다. 기저가 되려면 선형독립인 벡터가 정확히 $n$개 필요하고, 반대로 선형독립인 고유벡터 $n$개를 열로 모으면 $P$가 가역이 되어 대각화가 된다. 즉 <strong>"대각화 가능 ⇔ 선형독립인 고유벡터가 </strong>$n$<strong>개"</strong>이다.

선형독립인 고유벡터가 (n)개보다 적다면, 이 고유벡터들만으로는 (n)차원 공간의 기저를 구성할 수 없다. 따라서 고유벡터를 열벡터로 구성한 가역행렬 (P)를 만들 수 없으며, 해당 기저를 이용한 대각화가 불가능하다.

따라서 고유값·고유벡터를 알아낼 때에는 선형독립인 고유벡터가 n개 존재하는지 알아내야한다.

그것을 알아내기 위해서 AM(Algebraic multiplicity)과 GM(Geometric multiplicity)을 비교한다.

> <strong>판정 기준</strong> : $A$가 대각화 가능 ⇔ <strong>모든 고유값에서 GM = AM</strong> (이유는 아래 "3단계 연결" toggle) \[보완\] "3단계 연결" toggle은 현재 페이지에 없다. 이유는 바로 위 문단(독립 고유벡터 n개 ⇔ 기저)과 아래 Theorem 4.12 toggle을 보면 된다. 또 이 "⇔"은 실수 고유값이 충분히 나오는 경우를 전제로 한다. 특성다항식이 실수에서 완전히 인수분해되지 않으면(예: 회전행렬) GM=AM을 따지기 전에 실수 고유값이 모자라 실수 대각화가 안 된다.. 하나라도 $\text{GM}<\text{AM}$이면 대각화가 불가능하고, 그런 행렬을 defective라 부른다.

<details>

<summary>대수적 중복도 (Algebraic Multiplicity, AM)</summary>

> AM은 특성다항식에서 특정 고윗값이 근으로 등장하는 중복 횟수이다.

ex. <strong>예시:</strong> $p(\lambda) = (\lambda - 2)^2 (\lambda - 5)$
• $\lambda = 2$의 $\text{AM} = 2$
• $\lambda = 5$의 $\text{AM} = 1$
(중복까지 세면 AM의 합은 항상 $n$이다. 여기서는 $2+1=3$) \[보완\] 복소수 근까지 세었을 때 성립한다. 교재 Theorem 4.16도 $\lambda_i\in\mathbb C$로 쓴다. 실수 안에서는 합이 $n$보다 작을 수 있다.

$\text{AM}$은 고윗값의 중복 횟수를 알려주지만, 이것만으로 독립적인 고유벡터의 개수를 확정할 수는 없다.

</details>

<details>

<summary>기하적 중복도 (Geometric Multiplicity, GM)</summary>

> $(A-\lambda I)\mathbf{v}=\mathbf{0}$의 해 전체(영벡터 포함)인 고유공간 $E_\lambda=\ker(A-\lambda I)$의 <strong>차원</strong>이다. 즉 해당 고윗값에 대응하는 <strong>선형독립인 고유벡터를 최대 몇 개 확보할 수 있는지</strong>이며, rank-nullity에 의해 $\text{GM}=n-\text{rank}(A-\lambda I)$이다.

</details>

<details>

<summary><strong>\[예시\] 대각화 불가능한 행렬 (</strong>$3\times3$<strong>)</strong></summary>

<strong>1. 대상 행렬</strong> : $A=\begin{pmatrix}2&1&0\\0&2&0\\0&0&5\end{pmatrix}$

<strong>2. 고윗값과 AM</strong> : $\det(A-\lambda I)=(2-\lambda)^2(5-\lambda)=0$
• $\lambda=2$ : $\text{AM}=2$
• $\lambda=5$ : $\text{AM}=1$

<strong>3. 고유공간과 GM</strong> (각각 $(A-\lambda I)\mathbf{v}=\mathbf{0}$을 푸다)
• $\lambda=5$ : $A-5I=\begin{pmatrix}-3&1&0\\0&-3&0\\0&0&0\end{pmatrix}$은 rank 2이므로 자유변수 1개. $y=0,\;x=0$이고 $z$는 자유 ⇒ $E_5=\text{span}\{\mathbf{e}_3\}$, $\text{GM}=3-2=1$
• $\lambda=2$ : $A-2I=\begin{pmatrix}0&1&0\\0&0&0\\0&0&3\end{pmatrix}$도 rank 2이므로 자유변수 1개. $y=0,\;z=0$이고 $x$는 자유 ⇒ $E_2=\text{span}\{\mathbf{e}_1\}$, $\text{GM}=3-2=1$

<strong>4. 비교</strong> : $\lambda=2$에서 $\text{GM}=1<\text{AM}=2$ (defective). 독립인 고유벡터는 $\mathbf{e}_3,\mathbf{e}_1$ 두 개뿐이라 $\sum\text{GM}=2<n=3$이다.

<strong>5. 왜 </strong>$P$<strong>를 못 만드는가</strong> : $P=\begin{pmatrix}\mathbf{e}_3&\mathbf{e}_1&\mathbf{?}\end{pmatrix}$의 세 번째 열은 앞의 두 열과 독립인 <strong>고유벡터</strong>여야 한다. 그런데 이 $A$의 고유벡터는 $E_2$ 또는 $E_5$ 안에만 있으므로 전부 $\mathbf{e}_1$ 또는 $\mathbf{e}_3$의 상수배이고, 이미 쓴 방향이다. $\mathbf{e}_2$ 방향을 더하면 독립이 되지만 $A\mathbf{e}_2=(1,2,0)^\top$로 방향이 바뀌어 고유벡터가 아니다.

<strong>6. 대조</strong> : $B=\text{diag}(2,2,5)$도 특성다항식이 똑같이 $(2-\lambda)^2(5-\lambda)$이다. 그러나 $B-2I=\text{diag}(0,0,3)$은 rank 1이라 $\text{GM}(2)=3-1=2=\text{AM}$ ⇒ 대각화 가능(이미 대각행렬)이다. <strong>특성다항식(AM)이 같아도 판정이 갈린다. 그래서 GM을 직접 구해야 한다.</strong>

</details>

<details>

<summary><strong>Theorem 4.12 : 서로 다른 고유값의 고유벡터는 선형독립 (Defective 노트 병합)</strong></summary>

> <strong>Theorem 4.12</strong> 서로 다른 고유값 $\lambda_1,\dots,\lambda_n$이 $n$개이면 그 고유벡터 $x_1,\dots,x_n$은 <strong>선형독립</strong>이다. 따라서 $\mathbb{R}^n$의 기저가 된다.
<strong>Definition 4.13</strong> 선형독립인 고유벡터가 $n$개보다 적은 정사각행렬을 <strong>defective</strong>라 한다.

<details>

<summary>핵심 아이디어</summary>

> ※ 교재 밖 보충. 서로 다른 고유값의 고유벡터들이 선형종속이라고 가정하고, 계수가 모두 0이 아닌 <strong>가장 짧은</strong> 관계식 $\sum_i c_ix_i=0$을 잡는다.
양변에 $(A-\lambda_1I)$를 곱하면 $x_1$ 항은 사라지고 $\sum_{i\ge2}c_i(\lambda_i-\lambda_1)x_i=0$이 남는다. $\lambda_i\neq\lambda_1$이므로 계수는 모두 0이 아니고, 더 짧은 관계식이 되어 “가장 짧다”에 모순이다.

</details>

</details>

<details>

<summary><strong>경우 나누기 : 언제 독립 고유벡터가 </strong>$n$<strong>개 나오는가</strong></summary>

| 경우 | 고유벡터 | 예 |
| --- | --- | --- |
| 고유값이 서로 모두 다르다 | 독립 $n$개가 <strong>반드시</strong> 나온다 (Theorem 4.12) | $\begin{bmatrix}4&2\\1&3\end{bmatrix}$ ($\lambda=2,5$) |
| 중복 고유값이 있고 GM = AM | 독립 $n$개가 나온다. <strong>non-defective</strong> | $I$ ($\lambda=1$ 두 번, 고유벡터 2개) |
| 중복 고유값이 있고 GM이 AM보다 작다 | $n$개에 못 미친다. <strong>defective</strong> | $\begin{bmatrix}2&1\\0&2\end{bmatrix}$ (고유벡터 1개) |

<div class="callout" role="note" data-kind="intuition">

<strong>defective </strong>$\iff$<strong> 어떤 고유값에서 GM </strong>$<$<strong> AM.</strong>
따라서 defective 행렬은 서로 다른 고유값 $n$개를 가질 수 없다. (교재 Remark)
중복 고유값이 있다고 해서 곳바로 defective인 것은 아니다.

</div>

</details>

<div class="callout" role="note" data-kind="stuck">

<strong>막힐 가능성이 높은 지점 (Defective 노트 병합)</strong>

1. <strong>“중복 고유값 = defective”로 외우는 실수.</strong> 항등행렬이 반례이다.
1. <strong>Theorem 4.12는 한쪽 방향만 말한다.</strong> 고유값이 서로 다르면 독립이지만, 독립 고유벡터가 $n$개라고 해서 고유값이 서로 달라야 하는 것은 아니다.
1. <strong>서로 다른 고유값의 고유벡터는 독립</strong>이지, <strong>직교</strong>는 아니다. 직교는 대칭행렬일 때 따로 보장된다. (다음 노트)

</div>

</details>

<details>

<summary><strong>이걸 모르면?</strong></summary>

- "$\lambda=2$가 두 번 나오니 고유벡터도 2개겠지"처럼 AM만 보고 단정하게 된다. 그러면 존재하지 않는 $P$를 만들려다 막힌다. 대각화 여부는 GM으로 판정한다 (4.4)
- Defective 행렬(GM이 AM보다 작은 경우)의 정의 자체를 읽지 못한다 (다음 노트)
- 고유값분해 $A=PDP^{-1}$을 쓸 수 있는 행렬과 없는 행렬을 구분하지 못한다. 대칭행렬(공분산행렬 등, PCA)은 항상 대각화 가능해서 이 걱정이 필요 없지만(4.4 스펙트럴 정리), 일반 비대칭 행렬은 확인해야 한다

</details>

<details>

<summary><strong>문제</strong></summary>

[Untitled](https://app.notion.com/p/3f409d87213b816ca933da113e051a15)

[Untitled](https://app.notion.com/p/3f409d87213b81ceb1a2fcb1738b7289)

</details>
